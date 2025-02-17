<template>
  <q-page padding>
    <h1>Our Contacts</h1>
    <img
      class="home-img"
      alt="Quasar logo"
      src="~assets/contacts-map.jpg"
      style="width: 100%; height: 100%"
    />
    <div class="q-pa-md padding-0 any-link">
      <q-list bordered separator>
        <q-item clickable v-ripple>
          <q-item-section>Phone: <a href="tel:+380971234567">+380 97 123 4567</a></q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>Email: <a href="mailto:info@app.com">info@app.com</a></q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section
            >WhatsApp: <a href="https://wa.me/380971234567">+380 97 123 4567</a></q-item-section
          >
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
//
</script>
