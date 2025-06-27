---
layout: post-with-toc
title: "CharForge: character consistency with one reference"
description: "A guide for image captioning and prompt optimization"
author: "Rishi Desai"
date: 2025-06-30 00:00:00 -0700
categories: ai image-generation loras flux
kramdown:
  parse_block_html: true
---

> **Demo Available**: Try CharForge yourself [here](https://www.charforge.dev).

I spent hundreds of hours exploring character consistency in image generation models. I surveyed the best  methods from cutting-edge research to complex ComfyUI workflows. I synthesized this knowledge to build CharForge, the best method for generating character consistent images from a single reference.

<div class="image-flow-container" style="display: flex; align-items: center; justify-content: center; gap: 2rem; max-width: 700px; margin: 0 auto 2rem auto;">
    <img src="/assets/images/character/example_grid.jpeg" alt="Character examples grid" style="width: 100%; height: auto;">
</div>

### What's Character Consistency?

Character consistency is an AI model's ability to maintain a character's distinct appearance across multiple images and scenarios. This includes maintaining a consistent face, body, and outfit, all of which are notoriously difficult for image generation models to get right.

There are two classes of models for achieving character consistency:
- Inference-time generation, which uses a reference image during prompt-based generation.
- LoRA training, which teaches the model a specific character identity from a dataset.

<div class="prompts-table">
<table>
  <thead>
    <tr>
      <th></th>
      <th>Inference Time</th>
      <th>LoRA Training</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Closed-Source</th>
      <td><a href="https://platform.openai.com/docs/models/gpt-image-1">GPT Image 1</a>, <a href="https://runwayml.com/research/introducing-runway-gen-4">RunwayML Gen-4</a>, <a href="https://docs.midjourney.com/hc/en-us/articles/32162917505293-Character-Reference">Midjourney</a></td>
      <td><a href="https://openart.ai/characters">OpenArt</a></td>
    </tr>
    <tr>
      <th>Open-Source</th>
      <td><a href="https://github.com/bytedance/InfiniteYou">InfiniteYou</a>, <a href="https://github.com/ToTheBeginning/PuLID">PuLID</a>, <a href="https://github.com/ali-vilab/ACE_plus">ACE++</a></td>
      <td><a href="https://github.com/RishiDesai/CharForge">CharForge</a></td>
    </tr>
  </tbody>
</table>
</div>

# Inference Time Generation

### Closed-Source Models

The two best models are GPT Image 1 and RunwayML Gen-4. GPT's native image-generation can perform tasks that previously required multiple specialized models, like reference-based character generation, pose manipulation, style transfer, and inpainting. It has remarkable prompt-adherence, far better than Flux.1-dev, but face quality of real people does suffer (see [FaceEnhance](https://github.com/RishiDesai/FaceEnhance) for more details). Furthermore, GPT is slow and often refuses to answer harmless prompts.




### Open-Source Models

There are no good open-source image-to-image models that accept reference character images. There are, however, a class of models that generate images while maintaining face consistency. The best inference-time model is [Infinite-You](https://github.com/bytedance/InfiniteYou), followed by [PuLID-Flux.1-dev](https://github.com/ToTheBeginning/PuLID). These are image-to-image models that take a face input image and text prompt. 

The biggest weaknesses of these models is they can't reliably control hair, clothing, and multi-view consistency. The generated image often looks like the face is copy-pasted onto the person. Furthermore, they rely on InsightFace to extract facial embeddings. [Insightface](https://github.com/deepinsight/insightface) struggles to detect anime and cartoon characters' faces, so these models only work on photorealistic images of people. These are four images generated from the same face reference with InfiniteYou. 


<div class="image-grid-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; max-width: 450px; margin: 1.5rem auto; justify-items: center;">
    <img src="/assets/images/character/infiniteyou1.png" alt="InfiniteYou example 1" style="width: 100%; height: auto; border-radius: 8px;">
    <img src="/assets/images/character/infiniteyou2.png" alt="InfiniteYou example 2" style="width: 100%; height: auto; border-radius: 8px;">
    <img src="/assets/images/character/infiniteyou3.png" alt="InfiniteYou example 3" style="width: 100%; height: auto; border-radius: 8px;">
    <img src="/assets/images/character/infiniteyou4.png" alt="InfiniteYou example 4" style="width: 100%; height: auto; border-radius: 8px;">
</div>

If you want high-quality, full-body character consistency, especially across multiple angles and scenarios, training a LoRA is the superior approach and Flux.1-dev is the best open-source model for this.

# Training a LoRA

<div class="image-flow-container" style="display: flex; align-items: center; justify-content: center; gap: 2rem; max-width: 700px; margin: 0.5rem auto 0 auto; padding-top: 0.05rem; padding-bottom: 0;">
    <img src="/assets/images/character/trainlora.jpg" alt="Character sheet" style="width: 100%; height: auto;">
</div> 

Training a LoRA on Flux offers the best balance between efficiency and quality, and outperforms all inference-time approaches with respect to character consistency. To train a LoRA, we typically gather a dataset of 10-20 high quality images of the character in various poses, lighting and expressions
  
This is straightforward for popular characters and people, where you can easily find diverse high quality images online. But often with AI generated characters, we only have 1 generated image. We  can't train a LoRA on a single image, so we'll need to generate a character sheet. 

### What's a Character Sheet?

A character sheet is a curated collection of images depicting a character from multiple perspectives, poses, lighting, and expressions. These images serve as the dataset for training a LoRA model to generate consistent representations of the character across various contexts.

The character sheet must contain diverse but consistent visual information about the character. This ensures that the trained model can accurately reproduce the character's unique features, such as facial attributes, clothing, and accessories, across  generated images.

Since we only have one image of the character, we'll need to synthetically generate the entire character sheet.





