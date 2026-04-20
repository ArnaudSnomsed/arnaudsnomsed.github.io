---
layout: page
title: "Prolog"
---

<style>
  .image-gallery {
      display: grid;
      align-items: start;
      grid-template-columns: repeat(auto-fill,minmax(260px, 1fr));
  }


  .img-gallery {
      width: 400px;
      height: auto;
      max-height: 700px; 
      border: 5px solid white;
      object-fit: cover;
      transition: all 0.3s ease-in-out;
   }
   .img-gallery:hover {
       max-height: 950px;
       transform: scale(1.05);
   }
   
  @media (min-width: 768px) {
     .image-gallery {
         grid-template-columns: repeat(auto-fill,minmax(500px, 1fr));
      }
     .img-gallery {
	 width: 750px;
     }
   }

</style>

<div class ="image-gallery">
{% for item in site.data.prolog %}
  <div class="box"> <img src="{{ item.image }}" alt="{{ item.caption }}"  class="img-gallery" loading="lazy"></div>
{% endfor %}
</div>
