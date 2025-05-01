<template>
  <q-page padding class="q-mb-xl">
    <div>
      <h2 class="text-h5 text-center q-mt-xl">Reviews</h2>
      <q-card class="q-card-reviews">
        <q-card-section class="q-card-reviews-section">
          <div class="text-center">
            <h5 v-if="isDataLoaded && reviews.length === 0" class="text-center">
              No reviews available yet.
            </h5>
            <q-list v-if="isDataLoaded && reviews.length > 0" class="q-list-reviews">
              <q-item v-for="(review, index) in reviews" :key="index" class="q-item-reviews">
                <q-item-section>
                  <p>
                    <strong>{{ review.userName }}</strong>
                  </p>
                  <p>{{ review.comment }}</p>
                  <p>Rating: {{ review.rating }} / 5</p>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </q-card>
      <q-btn class="q-mt-xl" label="Add Review" color="primary" @click="openReviewForm" />
    </div>
  </q-page>
</template>

<script setup>
// import { ref, onMounted } from 'vue'
// import { useRoute } from 'vue-router'
// import axios from 'axios'

// const route = useRoute()
// const productId = route.params.id
// const reviews = ref([])
// const isDataLoaded = ref(false)

// onMounted(async () => {
//   try {
//     const response = await axios.get(`http://127.0.0.1:8000/api/reviews/${productId}`)
//     reviews.value = response.data
//     isDataLoaded.value = true
//   } catch (error) {
//     console.error('Error loading reviews:', error)
//   }
// })

// const openReviewForm = () => {
//   // Logic to open the review form modal or page
//   console.log('Open review form for product ID:', productId)
// }
</script>
