---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Home
---

<div class="flex mb-8 pb-5 border-b border-gray-200">
    <img src="{{ site.baseurl }}/assets/images/main/headshot.jpeg" alt="Rishi Desai's Headshot" class="w-56 mr-5">
    <div>
        <h1 class="text-black text-3xl font-semibold mt-0 mb-3">Rishi Desai</h1>
        <p class="mt-3">
            <a href="https://x.com/rishi_desai2" class="text-black no-underline mr-4 hover:text-red-900 transition-colors duration-150" aria-label="Twitter"><i class="fab fa-x-twitter fa-lg"></i></a>
            <a href="https://github.com/RishiDesai" class="text-black no-underline mr-4 hover:text-red-900 transition-colors duration-150" aria-label="GitHub"><i class="fab fa-github fa-lg"></i></a>
            <a href="https://www.linkedin.com/in/rishi-desai1/" class="text-black no-underline mr-4 hover:text-red-900 transition-colors duration-150" aria-label="LinkedIn"><i class="fab fa-linkedin fa-lg"></i></a>
            <a href="mailto:rdesai2@alumni.stanford.edu" class="text-black no-underline mr-4 hover:text-red-900 transition-colors duration-150" aria-label="Email"><i class="fas fa-envelope fa-lg"></i></a>
        </p>
    </div>
</div>

<section id="about" class="mb-10 pb-5 border-b border-gray-200">
    <h2 class="text-2xl font-medium mb-4">About</h2>
    <p>I'm an AI engineer based in San Francisco. I previously graduated from Stanford with a BS and MS in computer science. Recently, I've been exploring character consistency in image generation. If you're working in a similar area, please reach out— I'm always happy to chat!</p>
</section>

<section id="posts" class="mb-10 pb-5 border-b border-gray-200">
    <h2 class="text-2xl font-medium mb-4">Posts</h2>
    <div class="mb-5 flex">
        <img src="{{ site.baseurl }}/assets/images/main/charforge.jpg" alt="Character Consistency" class="w-48 h-36 object-cover object-top mr-4">
        <div>
            <h3 class="text-xl font-medium">
                <a href="/posts/character/" class="text-red-900 no-underline hover:underline">CharForge: character consistency with one reference image</a>
            </h3>
            <p class="text-gray-600">June 27, 2025</p>
            <p>A guide for achieving character consistency from a single reference image.</p>
            <p>
                <a href="https://www.charforge.dev" class="text-red-900 no-underline mr-2 hover:underline">demo</a> /&nbsp;
                <a href="https://github.com/RishiDesai/CharForge" class="text-red-900 no-underline mr-2 hover:underline">code</a>
            </p>
        </div>
    </div>
    <div class="mb-5 flex">
        <img src="{{ site.baseurl }}/assets/images/main/sukuna.png" alt="Sukuna Character Sheet" class="w-48 h-36 object-cover object-top mr-4">
        <div>
            <h3 class="text-xl font-medium">
                <a href="/posts/character-lora/" class="text-red-900 no-underline hover:underline">Unlocking Character LoRAs with Structured Captions</a>
            </h3>
            <p class="text-gray-600">May 8, 2025</p>
            <p>A guide for image captioning and prompt optimization.</p>
            <p>
                <a href="https://huggingface.co/spaces/rdesai2/LoRACaptioner" class="text-red-900 no-underline mr-2 hover:underline">demo</a> /&nbsp;
                <a href="https://github.com/RishiDesai/LoRACaptioner" class="text-red-900 no-underline mr-2 hover:underline">code</a>
            </p>
        </div>
    </div>
    <div class="mb-5 flex">
        <img src="{{ site.baseurl }}/assets/images/main/face-enh.gif" alt="Comparison GIF" class="w-48 h-36 object-cover object-top mr-4">
        <div>
            <h3 class="text-xl font-medium">
                <a href="/posts/face-enhancement-techniques/" class="text-red-900 no-underline hover:underline">Fixing Face Consistency in GPT-4o Image Gen</a>
            </h3>
            <p class="text-gray-600">April 21, 2025</p>
            <p>A guide to enhancing faces in AI generated images.</p>
            <p>
                <a href="https://huggingface.co/spaces/rdesai2/FaceEnhance" class="text-red-900 no-underline mr-2 hover:underline">demo</a> /&nbsp;
                <a href="https://github.com/RishiDesai/FaceEnhance" class="text-red-900 no-underline mr-2 hover:underline">code</a>
            </p>
        </div>
    </div>
</section>

<section id="publications" class="mb-10 pb-5 border-b border-gray-200">
    <h2 class="text-2xl font-medium mb-4">Publications</h2>
    <div class="mb-5 flex border-b border-dotted border-gray-200 pb-5">
        <img src="{{ site.baseurl }}/assets/images/main/aistats24.gif" alt="Publication 1 Image" class="w-48 h-36 object-cover mr-4">
        <div>
            <h3 class="text-xl font-medium">Privacy-Constrained Policies via Mutual Information Regularized Policy Gradients</h3>
            <p>Chris Cundy*, <strong>Rishi Desai*</strong>, and Stefano Ermon</p>
            <p>AISTATS 2024</p>
            <p>
                <a href="https://proceedings.mlr.press/v238/cundy24a/cundy24a.pdf" class="text-red-900 no-underline mr-2 hover:underline" >paper</a>
            </p>
        </div>
    </div>
    
    <div class="mb-5 flex border-b border-dotted border-gray-200 pb-5">
        <img src="{{ site.baseurl }}/assets/images/main/iccv21.gif" alt="Publication 2 Image" class="w-48 h-36 object-cover mr-4">
        <div>
            <h3 class="text-xl font-medium">Detecting Human-Object Relationships in Videos</h3>
            <p>Jingwei Ji, <strong>Rishi Desai</strong>, Juan Carlos Niebles</p>
            <p>ICCV 2021</p>
            <p>
                <a href="https://openaccess.thecvf.com/content/ICCV2021/papers/Ji_Detecting_Human-Object_Relationships_in_Videos_ICCV_2021_paper.pdf" class="text-red-900 no-underline mr-2 hover:underline" >paper</a>
            </p>
        </div>
    </div>
    
    <div class="mb-5 flex border-b border-dotted border-gray-200 pb-5">
        <img src="{{ site.baseurl }}/assets/images/main/cvpr21.png" alt="Publication 3 Image" class="w-48 h-36 object-cover mr-4">
        <div>
            <h3 class="text-xl font-medium">Home Action Genome: Cooperative Compositional Action Understanding</h3>
            <p>Nishant Rai, Haofeng Chen, Jingwei Ji, <strong>Rishi Desai</strong>, Kazuki Kozuka, Shun Ishizaka, Ehsan Adeli, Juan Carlos Niebles</p>
            <p>CVPR 2021</p>
            <p>
                <a href="https://arxiv.org/pdf/2105.05226.pdf" class="text-red-900 no-underline mr-2 hover:underline" >paper</a> /&nbsp; 
                <a href="https://homeactiongenome.org/" class="text-red-900 no-underline mr-2 hover:underline" >project</a>
            </p>
        </div>
    </div>
    
    <div class="mb-5 flex">
        <img src="{{ site.baseurl }}/assets/images/main/visnab.jpg" alt="Publication 4 Image" class="w-48 h-36 object-cover mr-4">
        <div>
            <h3 class="text-xl font-medium">BioFabric Visualization of Network Alignments</h3>
            <p><strong>Rishi Desai</strong>, William JR Longabaugh, Wayne Hayes</p>
            <p>Recent Advances in Biological Network Analysis, Springer, 2021</p>
            <p>
                <a href="https://link.springer.com/chapter/10.1007/978-3-030-57173-3_4" class="text-red-900 no-underline mr-2 hover:underline" >paper</a> 
            </p>
        </div>
    </div>
</section>
