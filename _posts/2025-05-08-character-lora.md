---
layout: post-with-toc
title: "Unlocking Character LoRAs with Structured Captions"
description: "A guide for image captioning and prompt optimization"
author: "Rishi Desai"
date: 2025-05-08 00:00:00 -0700
categories: ai image-generation loras flux
kramdown:
  parse_block_html: true
---

> **Demo Available**: Caption and prompt your LoRAs [here](https://huggingface.co/spaces/rdesai2/LoRACaptioner).


You've carefully curated images of your favorite character and trained a LoRA, but when you start prompting the results don't look anything like your dataset. A common story in the image gen community...

Why is generating images that precisely follow prompts like these so difficult?

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; max-width: 520px; margin: 20px auto;">
  <img src="/assets/images/character-lora/sukuna_4.png" alt="Sukuna example 4" style="width: 100%; height: auto;">
  <img src="/assets/images/character-lora/sukuna_5.png" alt="Sukuna example 5" style="width: 100%; height: auto;">
  <img src="/assets/images/character-lora/sukuna_6.png" alt="Sukuna example 6" style="width: 100%; height: auto;">
  <img src="/assets/images/character-lora/sukuna_7.png" alt="Sukuna example 7" style="width: 100%; height: auto;">
</div>

I ran into this problem while training LoRAs on Flux. Even with high-quality images the results were disappointing. After investigating, I realized the issue wasn't with the images but the captions.

Captioning is rarely discussed and often abstracted away by LoRA training services. From extensive experimentation, I've found clear, consistent, and structured captions are essential for training expressive and robust LoRAs.

In this post, I'll share a straightforward approach to captioning that takes the guesswork out of training character LoRAs.

# Image Captioning

A LoRA dataset has two parts: images and captions. Since we're training a character LoRA, let's start with a character I generated with [Flux.1-dev](https://huggingface.co/black-forest-labs/FLUX.1-dev):

<div style="display: flex; justify-content: center; gap: 10px; margin: 20px 0;">
  <img src="/assets/images/face-enhancement/woman_body.png" alt="Full Body Image" style="width: 35%; max-width: 300px;">
</div>

### The Images
This character sheet was generated with [Mickmumpitz's](https://x.com/mickmumpitz) Flux character consistency workflow. With just one reference image, this workflow generates 18 new images: 1 frontal face view, 5 full-body angles, 4 face angles, 4 facial expressions, and 4 lighting conditions.

<div style="display: flex; justify-content: center; gap: 10px; margin: 20px 0;">
  <img src="/assets/images/character-lora/char_sheet.jpg" alt="Character Sheet" width="90%" style="max-width: 800px;">
</div>

All images are square with resolutions of at least 1024x1024. This is important: *inconsistent aspect ratios degrade generation quality*. If your dataset contains images of varying dimensions, crop or resize them to match. Furthermore, your training resolution should meet or exceed your target inference resolution. I want HD outputs, so I'll resize the images to 1024x1024.


### A Template for Captions
When training a LoRA on Flux, precise and consistent image captions are essential. Captioning with tags rather than natural language is more effective for clarity and consistency. Each caption must specify all variable visual elements such as clothing, accessories, poses, expressions, and lighting. This is the template I created: 

`[Trigger Word] [Style], [Notable Visual Features], [Clothing], [Pose], [Expression/Mood], [Background/Setting], [Lighting], [Camera Angle]`

I include style (e.g., photorealistic, anime) for completion; however, for style transfer I recommend training a separate style LoRA and chaining it to the character LoRA. Avoid subjective language (e.g., "beautiful", "scary") and references to known characters or real people. Objectivity is key to clear, reliable captions. 

We need a trigger word in our captions to "activate" the LoRA during inference. Its placement does not matter as long as you're consistent with it; it can be any nonsense word. Do not include inherent features that are constant, such as eye, hair, or skin color, unless it's variable to the character. For example, if your character always has blue eyes - don't mention it in any of the captions! Similarly, if you only want to generate scenes with the character in the same outfit, don't mention the outfit. 

### Which Tags Should I Include? 
The template above encompasses all aspects of the scene. But you often don't need this level of detail. If certain elements like clothes, expressions, or style are constant - remove it from the template. Unnecessary fields add noise to the training process.

Some example captions:

- `tr1gg3r photorealistic, curly shoulder-length hair, black blazer over turtleneck top, hands on hips, neutral expression, urban street with neon signs, bright diffused lighting, front view`
- `tr1gg3r photorealistic, curly shoulder-length hair, brown coat with scarf, seated holding a cup, contemplative expression, autumn park with yellow foliage, soft ambient lighting, front view`


<div style="display: flex; justify-content: center; gap: 15px; margin: 20px 0; flex-wrap: wrap;">
  <img src="/assets/images/character-lora/woman_ex_1.png" alt="Woman in black blazer" style="width: 30%; max-width: 300px;">
  <img src="/assets/images/character-lora/woman_ex_2.png" alt="Woman in brown coat" style="width: 30%; max-width: 300px;">
</div>

### Generating Captions
If you're using any LoRA training service, _do not use their auto captioning feature_. They often produce inconsistent tags or natural language descriptions that degrade training quality. 

Instead, use an LLM like GPT-4o to produce the structured set of tags. For consistency, caption all images in a single chat thread, and caption similar images within the same chat message. For example, one message for expressions, another for face angles, and so on. If you follow these steps, GPT-4o will make a consistent set of tags across your dataset.

Using a single thread with multiple images per message works well inside ChatGPT. However, it's not possible with the GPT-4o API, which refuses to caption images due to privacy concerns. Instead, use open-source models like DeepSeek or Llama 4.

With APIs, it's generally infeasible to caption all images in one thread, and most APIs like [together.ai](https://www.together.ai/) limit the number of images in a single message. The best compromise I found is to use one thread per image category (e.g., expressions, face angles) and caption unrelated images in individual threads.

### Training Configuration
For my dataset, I found 1000 steps and LoRA rank of 16 provided a good balance between quality and training time. I used a learning rate of 8e-4 and batch size of 1. 

Training at 512x512 speeds up training time to around 30 minutes, which is great if you can upscale at test time; otherwise 768x768 is a good middle ground. For my examples, I trained at rank 16 and 1024x1024 resolution for quality. With a single L40S GPU with 48GB VRAM, the training run takes around 60 minutes running Flux.1-dev at bfloat16 precision.

Regardless of your setup, fix the image resolution across your dataset.

# Prompt Optimization

Our prompts must adhere to the same format as the training set captions. Enter prompt optimization. A simple method is using an LLM: provide all image captions as context and ask it to rewrite your initial prompt to match the structure of the captions. For example, a simple prompt like: 

`tr1gg3r riding a bike on a cobblestone street in an Italian town`

can be optimized to 

`tr1gg3r photorealistic, curly shoulder-length hair, floral button-up shirt and light blue skinny jeans, riding a bicycle, smiling expression, cobblestone street in Italian town, soft afternoon lighting, three-quarter view`

<div style="display: flex; justify-content: center; margin: 20px 0;">
  <img src="/assets/images/character-lora/woman_ex_3.png" alt="Woman riding bicycle in Italian town" style="width: 30%; max-width: 300px;">
</div>

This allows you to prompt in natural language without any guesswork. Since most prompts are underdetermined, the LLM can intelligently fill in missing details. This simple step gives you significantly more control over the output.


### Inference Configuration 
As mentioned above, your inference resolution should match your training resolution. LoRA weight is the most important inference parameter. The ideal value varies by dataset, but it typically lies between 0.6 and 1.0. The easiest way to determine the weight is through simple trial-and-error. 

If you prefer a more quantitative way, you can use the Face Embed Distance (FED) metric to evaluate how close your generated images' faces are to your reference face. It's a simple heuristic that makes pinpointing the optimal LoRA weight easier. See my [previous blog post](https://rishidesai.github.io/posts/face-enhancement-techniques/) for more information on FED. 


# Results

### A Character generated by Flux.1-dev

<div class="examples-grid">
  <div class="example-container">
    <h5>User Prompt:</h5>
    <p class="simple-prompt">riding a horse on a prairie during sunset</p>
    
    <h5>Optimized Prompt:</h5>
    <p class="optimized-prompt">tr1gg3r photorealistic, curly shoulder-length hair, floral button-up shirt, riding a horse, neutral expression, prairie during sunset, warm directional lighting, three-quarter view</p>
    
    <div class="example-image">
      <img src="/assets/images/character-lora/woman_1.png" alt="Woman riding a horse">
    </div>
  </div>
  
  <div class="example-container">
    <h5>User Prompt:</h5>
    <p class="simple-prompt">painting on a canvas in an art studio, side-view</p>
    
    <h5>Optimized Prompt:</h5>
    <p class="optimized-prompt">tr1gg3r photorealistic, curly shoulder-length hair, floral button-up shirt, standing at an angle with brush in hand, neutral expression, art studio with canvas and paints, soft natural lighting, right side profile</p>
    
    <div class="example-image">
      <img src="/assets/images/character-lora/woman_2.png" alt="Woman painting in studio">
    </div>
  </div>
  
  <div class="example-container">
    <h5>User Prompt:</h5>
    <p class="simple-prompt">standing on a skyscraper in a dense city, dramatic stormy lighting, rear view</p>
    
    <h5>Optimized Prompt:</h5>
    <p class="optimized-prompt">tr1gg3r photorealistic, curly shoulder-length hair, floral button-up shirt, standing upright, neutral expression, skyscraper rooftop in dense city, dramatic stormy lighting, back view</p>
    
    <div class="example-image">
      <img src="/assets/images/character-lora/woman_3.png" alt="Woman on skyscraper">
    </div>
  </div>
</div>

### Sukuna from Jujutsu Kaisen

I trained a Sukuna character LoRA on Flux.1-dev from these images I collected online:

<div style="display: flex; justify-content: center; align-items: center; margin: 20px 0;">
  <img src="/assets/images/character-lora/sukuna_sheet.png" alt="Sukuna Character Sheet" style="width: 70%; max-width: 800px;">
</div>

<div class="examples-grid">
  <div class="example-container">
    <h5>User Prompt:</h5>
    <p class="simple-prompt">holding a bow and arrow in a dense forest</p>
    
    <h5>Optimized Prompt:</h5>
    <p class="optimized-prompt">tr1gg3r anime-style, pink spiky hair and black markings on face, shirtless with dark arm bands, holding bow and arrow, focused expression, dense forest, soft dappled lighting, three-quarter view</p>
    
    <div class="example-image">
      <img src="/assets/images/character-lora/sukuna_1.png" alt="Sukuna with bow and arrow">
    </div>
  </div>
  
  <div class="example-container">
    <h5>User Prompt:</h5>
    <p class="simple-prompt">drinking coffee in a san francisco cafe, white cloak, side view</p>
    
    <h5>Optimized Prompt:</h5>
    <p class="optimized-prompt">tr1gg3r anime-style, spiky pink hair and facial markings, white cloak, sitting with cup in hand, neutral expression, cafe interior with san francisco view, soft natural lighting, side profile</p>
    
    <div class="example-image">
      <img src="/assets/images/character-lora/sukuna_2.png" alt="Sukuna drinking coffee">
    </div>
  </div>
  
  <div class="example-container">
    <h5>User Prompt:</h5>
    <p class="simple-prompt">playing pick-up basketball on a sunny day</p>
    
    <h5>Optimized Prompt:</h5>
    <p class="optimized-prompt">tr1gg3r photorealistic, athletic build, sleeveless basketball jersey and shorts, jumping with ball, focused expression, outdoor basketball court with spectators, bright sunlight, low-angle view</p>
    
    <div class="example-image">
      <img src="/assets/images/character-lora/sukuna_3.png" alt="Sukuna playing basketball">
    </div>
  </div>
</div>

### Parting Thoughts
Clear, consistent captioning is the basis of a strong character LoRA. With a principled caption generation and prompt optimization, you can eliminate guesswork and get reliable, high-quality results every time.

