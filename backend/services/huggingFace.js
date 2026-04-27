import axios from 'axios';

class HuggingFaceService {
  constructor() {
    this.inferenceBaseUrl = 'https://router.huggingface.co/hf-inference/models';
    this.userApiKey = null;
  }

  setUserApiKey(apiKey) {
    this.userApiKey = apiKey;
  }

  get apiKey() {
    return this.userApiKey || process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN || '';
  }

  get models() {
    return {
      chat: process.env.TEXT_MODEL || 'meta-llama/Llama-3.1-8B-Instruct',
      codeGeneration: process.env.CODE_MODEL || 'Qwen/Qwen2.5-Coder-7B-Instruct',
      dataAnalysis: process.env.ANALYSIS_MODEL || process.env.TEXT_MODEL || 'meta-llama/Llama-3.1-8B-Instruct',
      imageGeneration: process.env.IMAGE_MODEL || 'black-forest-labs/FLUX.1-schnell',
      imageInpainting: process.env.IMAGE_EDIT_MODEL || 'black-forest-labs/FLUX.1-Kontext-dev',
      imageToText: process.env.IMAGE_TO_TEXT_MODEL || 'HuggingFaceTB/SmolVLM-Instruct',
      visualQA: process.env.VISION_MODEL || 'HuggingFaceTB/SmolVLM-Instruct',
    };
  }

  getHeaders(extraHeaders = {}) {
    if (!this.apiKey) {
      throw new Error('Missing Hugging Face API key. Set HUGGINGFACE_API_KEY or HF_TOKEN in backend/.env and restart the backend.');
    }

    return {
      Authorization: `Bearer ${this.apiKey}`,
      ...extraHeaders
    };
  }

  getModelUrl(model) {
    return `${this.inferenceBaseUrl}/${model}`;
  }

  getChatCompletionsUrl() {
    return 'https://router.huggingface.co/v1/chat/completions';
  }

  getChatMessages(messages) {
    return messages.map((message) => ({
      role: message.role,
      content: message.content
    }));
  }

  extractChatCompletionText(data) {
    const content = data?.choices?.[0]?.message?.content;

    if (typeof content === 'string') {
      return content;
    }

    if (Array.isArray(content)) {
      return content
        .map((part) => (typeof part === 'string' ? part : part?.text || ''))
        .join('')
        .trim();
    }

    return '';
  }

  extractGeneratedText(data) {
    if (Array.isArray(data) && data.length > 0) {
      return data[0].generated_text || '';
    }

    if (data && typeof data === 'object' && typeof data.generated_text === 'string') {
      return data.generated_text;
    }

    return '';
  }

  normalizeError(task, error) {
    const status = error.response?.status;
    let details = error.message;

    if (error.response?.data) {
      if (Buffer.isBuffer(error.response.data)) {
        details = error.response.data.toString('utf8');
      } else if (typeof error.response.data === 'string') {
        details = error.response.data;
      } else if (typeof error.response.data === 'object' && error.response.data.error) {
        details = typeof error.response.data.error === 'string'
          ? error.response.data.error
          : error.response.data.error.message || JSON.stringify(error.response.data.error);
      }
    }

    if (status === 401) {
      details = 'Hugging Face rejected the API token. Set a valid HUGGINGFACE_API_KEY or HF_TOKEN in backend/.env and restart the backend.';
    } else if (status === 404) {
      details = `The configured Hugging Face model for ${task} is unavailable.`;
    }

    return {
      success: false,
      error: details
    };
  }

  async chatCompletion(messages, options = {}) {
    try {
      const response = await axios.post(
        this.getChatCompletionsUrl(),
        {
          model: this.models.chat,
          messages: this.getChatMessages(messages),
          max_tokens: options.maxTokens || 1024,
          temperature: options.temperature || 0.7,
          top_p: options.topP || 0.95
        },
        {
          headers: this.getHeaders({ 'Content-Type': 'application/json' }),
          timeout: 30000
        }
      );

      const text = this.extractChatCompletionText(response.data);
      if (text) {
        return {
          success: true,
          text,
          model: this.models.chat
        };
      }
      
      return {
        success: false,
        error: 'Invalid response format'
      };
    } catch (error) {
      console.error('HuggingFace Chat Error:', error.response?.status || error.message);
      return this.normalizeError('chat', error);
    }
  }

  async generateImage(prompt, options = {}) {
    try {
      const response = await axios.post(
        this.getModelUrl(this.models.imageGeneration),
        {
          inputs: prompt,
          parameters: {
            negative_prompt: options.negativePrompt || '',
            height: options.height || 512,
            width: options.width || 512,
            guidance_scale: options.guidanceScale || 7.5,
            num_inference_steps: options.steps || 50
          }
        },
        {
          headers: this.getHeaders({ Accept: 'image/jpeg' }),
          responseType: 'arraybuffer',
          timeout: 60000
        }
      );

      const mimeType = response.headers['content-type'] || 'image/jpeg';
      const base64Image = Buffer.from(response.data).toString('base64');
      return {
        success: true,
        image: `data:${mimeType};base64,${base64Image}`,
        model: this.models.imageGeneration
      };
    } catch (error) {
      console.error('HuggingFace Image Generation Error:', error.response?.status || error.message);
      return this.normalizeError('image generation', error);
    }
  }

  async editImage(imageBase64, prompt, options = {}) {
    try {
      const normalizedImage = imageBase64.startsWith('data:')
        ? imageBase64.split(',')[1]
        : imageBase64;

      const response = await axios.post(
        this.getModelUrl(this.models.imageInpainting),
        {
          inputs: normalizedImage,
          parameters: {
            prompt,
            negative_prompt: options.negativePrompt || '',
            guidance_scale: options.guidanceScale || 7.5,
            num_inference_steps: options.steps || 30,
            target_size: {
              width: options.width || 512,
              height: options.height || 512
            }
          }
        },
        {
          headers: this.getHeaders({
            'Content-Type': 'application/json',
            Accept: 'image/jpeg'
          }),
          responseType: 'arraybuffer',
          timeout: 60000
        }
      );

      const mimeType = response.headers['content-type'] || 'image/jpeg';
      const base64Image = Buffer.from(response.data).toString('base64');
      return {
        success: true,
        image: `data:${mimeType};base64,${base64Image}`,
        model: this.models.imageInpainting
      };
    } catch (error) {
      console.error('HuggingFace Image Editing Error:', error.response?.status || error.message);
      return this.normalizeError('image editing', error);
    }
  }

  async analyzeImage(imageBase64, question = 'What is in this image?') {
    try {
      const imageUrl = imageBase64.startsWith('data:')
        ? imageBase64
        : `data:image/png;base64,${imageBase64}`;

      const response = await axios.post(
        'https://router.huggingface.co/v1/chat/completions',
        {
          model: this.models.visualQA,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: question },
                { type: 'image_url', image_url: { url: imageUrl } }
              ]
            }
          ]
        },
        {
          headers: this.getHeaders({ 'Content-Type': 'application/json' }),
          timeout: 30000
        }
      );

      const analysis = response.data?.choices?.[0]?.message?.content;
      if (analysis) {
        return {
          success: true,
          analysis,
          model: this.models.visualQA
        };
      }

      return {
        success: false,
        error: 'Invalid response format'
      };
    } catch (error) {
      console.error('HuggingFace Image Analysis Error:', error.response?.status || error.message);
      return this.normalizeError('image analysis', error);
    }
  }

  async codeGeneration(prompt, options = {}) {
    try {
      const response = await axios.post(
        this.getChatCompletionsUrl(),
        {
          model: this.models.codeGeneration,
          messages: [
            {
              role: 'system',
              content: 'You are a concise coding assistant. Return only the answer to the user request.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: options.maxTokens || 2048,
          temperature: options.temperature || 0.5,
          top_p: options.topP || 0.95
        },
        {
          headers: this.getHeaders({ 'Content-Type': 'application/json' }),
          timeout: 30000
        }
      );

      const text = this.extractChatCompletionText(response.data);
      if (text) {
        return {
          success: true,
          text,
          model: this.models.codeGeneration
        };
      }

      return {
        success: false,
        error: 'Invalid response format'
      };
    } catch (error) {
      console.error('HuggingFace Code Generation Error:', error.response?.status || error.message);
      return this.normalizeError('code generation', error);
    }
  }

  getAvailableModels() {
    return this.models;
  }
}

export const huggingFaceService = new HuggingFaceService();
