<template>
  <div id="app" v-if="dataLoadingCompleted">
    <header>
      <div class="funda-header">
        <img src="https://assets.fstatic.nl/master_1672/assets/components/logo/fundawonen-logo.svg" width="105" height="35">
      </div>
    </header>
    <carousel-3d  ref="mainCarousel" :count="carouselImages.length" :controls-visible="true" :display=3 :height="380" :width="580" 
     @after-slide-change="onAfterSlideChange">
      <slide v-for="(slide, i) in carouselImages" :index="i" :key=i>
        <figure>
          <img :src=slide>
          <figcaption>
              This space can be used to tell the story of the house
          </figcaption>
        </figure>
      </slide>
    </carousel-3d>
    <carousel-3d ref="sliderCarousel" :disable3d="true" :width="120" :height="80" :count="sliderImages.length" :space="140"
    :display="9"
    :controls-visible="true" class="thumbnail"
    @after-slide-change="onAfterSlideChange">
      <slide v-for="(slide, i) in sliderImages" :index="i" :key=i>
        <img :src=slide>
      </slide>
    </carousel-3d>

    <div class="details">
      <div v-for="(value, key) in houseDetails" :key=key class="house-details">
        <span class="key">{{ key }}</span>
        <span class="value">{{ value }}</span>
      </div>
    </div>

    <gmap-map
      :center="{lat: latitude, lng: longitude}"
      map-type-id="terrain"
      :zoom= "15"
      style="width: 500px; height: 300px">
      <gmap-marker
        :position="{lat: latitude, lng: longitude}"
        :clickable="true"
        :draggable="true">
      </gmap-marker>
    </gmap-map>
    <footer>
      <div class="funda-footer">
        <span><a href="https://www.funda.nl/privacybeleid/" target="_blank">Privacy</a></span>
        <span><a href="https://www.funda.nl/gebruiksvoorwaarden/" target="_blank">Conditions</a></span>
      </div>
    </footer>
  </div>
</template>

<script>
import { Carousel3d, Slide } from 'vue-carousel-3d'
export default {
  name: 'app',
  data () {
    return {
      slides: 7,
      houseData: null,
      houseDetails: {},
      carouselImages: [],
      sliderImages: [],
      dataLoadingCompleted: false,
      currentIndex: 0,
      latitude: 0,
      longitude: 0
    }
  },
  components: {
     'carousel-3d': Carousel3d,
     'slide': Slide
  },
  beforeMount() {
    this.$http.get("https://cors-anywhere.herokuapp.com/http://partnerapi.funda.nl/feeds/Aanbod.svc/json/detail/005e7c1d6f6c4f9bacac16760286e3cd/koop/6289a7bb-a1a8-40d5-bed1-bff3a5f62ee6/").then(function(data){
      this.houseData = data;
      this.populateMapData(this.houseData.data.WGS84_Y, this.houseData.data.WGS84_X);
      this.populateHouseDetails(this.houseData.data);
      this.populateMedia(this.houseData.data.Media);
    })
  },
  methods: {
    populateMedia(media) {
      Object.values(media).forEach(media => {
         media.MediaItems.forEach(mediaItem => {
           if (mediaItem.Category == 6) {
             this.carouselImages.push(mediaItem.Url);
           }
           if (mediaItem.Category == 1) {
             this.sliderImages.push(mediaItem.Url);
           }
         })
       })
       this.dataLoadingCompleted = true;
    },
    populateMapData(latitude, longitude) {
      this.latitude = latitude;
      this.longitude = longitude;
    },
    populateHouseDetails(houseDetails){
      this.houseDetails = {
        Adres: houseDetails.Adres,
        Plaats: houseDetails.Plaats,
        Postcode: houseDetails.Postcode,
        AantalKamers: houseDetails.AantalKamers,
        AantalWoonlagen: houseDetails.AantalWoonlagen,
        AantalBadkamers: houseDetails.AantalBadkamers,
        Garage: houseDetails.Garage,
        GarageIsolatie: houseDetails.GarageIsolatie,
        GarageVoorzieningen: houseDetails.GarageVoorzieningen,
        PermanenteBewoning: houseDetails.PermanenteBewoning
      }
    },
    onAfterSlideChange(index) {
      //to keep both carousels in sync
      //It would have been nicer if 3D carousel had API to set the currentSlider
      //I already created an issue in the github and implemented the solution -https://github.com/Wlada/vue-carousel-3d/issues/75
      if(index==this.currentIndex)
        return;
      this.currentIndex = index;
      this.$refs.sliderCarousel.goSlide(index);
      this.$refs.mainCarousel.goSlide(index);
    },
  },
}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.funda-header {
  width: 100%;
  padding: 10px 0;
  background-color: #F7A100;
}

.carousel-3d-container figure {
  margin:0;
}

.carousel-3d-container figcaption {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-weight: bold;
  bottom: 0;
  position: absolute;
  bottom: 0;
  padding: 15px;
  font-size: 15px;
  min-width: 100%;
  box-sizing: border-box;
  text-align: center;
}

img {
  cursor: pointer;
}

.vue-map-container {
  width: 100% !important;
}

.details {
  padding: 30px 50px;
}

@media only screen 
  and (min-device-width: 320px) 
  and (max-device-width: 480px)
  and (-webkit-min-device-pixel-ratio: 2)
  and (orientation: portrait) {
    .details {
      padding: 0;
    }
    span.value {
      text-align: right;
    }
}

.house-details {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #C0C0C0;
  padding: 5px 0;
}

span.key {
  flex: 0 0 30%;
}

span.value {
  flex: 0 70%;
}

.funda-footer {
  width: 100%;
  padding: 20px 10px;
  background-color: #D3D3D3;
  color: #F7A100;
  font-weight: bold;
  font-size: 16px;
}

.funda-footer >span {
  margin: 0 10px;
  cursor: pointer;
}
</style>
