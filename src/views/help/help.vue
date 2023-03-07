<script setup lang="ts">
import Navbar from '@/components/navbar/navbar.vue';
import AddList from '@/components/add-list/add-list.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
import helpData from '@/data/help.json';

const addOverlay = ref<boolean>(false)
const activeText = ref<number | null>(null)
const infoRefs = ref<HTMLElement[]>([]);
const infoDesktopRefs = ref<HTMLElement[]>([]);
const handleOverlay: () => void = () => { 
  addOverlay.value = !addOverlay.value
}

const toggleTextMobile: (index : number) => void = (index) => { 
    console.log(index);
    
    if(activeText.value == index) {
        activeText.value = null
        infoRefs.value[index].style.height = '0px';
    }  else {
        activeText.value = index
        infoRefs.value[index].style.height =  infoRefs.value[index].scrollHeight + 'px';
    } 
}

const toggleTextDesktop: (index : number) => void = (index) => { 
    console.log(index);
    infoDesktopRefs.value.forEach(el => el.style.height = '0px')
    
    if(activeText.value == index) {
        activeText.value = null
    }  else {
        activeText.value = index
        infoDesktopRefs.value[index].style.height =  infoDesktopRefs.value[index].scrollHeight + 'px';
    } 
}
</script>

<template>
    <section class="help">
        <Navbar param="help" @click="handleOverlay" />
        <div class="desktop-info">
            <h2>How it works</h2>
            <div class="info-container" v-for="item, index in helpData.desktop">
                <div class="help__headline" @click="toggleTextDesktop(index)">
                    <h3>{{ item.title }}</h3>
                    <font-awesome-icon icon="chevron-down" :class="{ 'display-text--active': index === activeText }" />
                </div>
                <div class="text-container" :class="{ 'info-active': index === activeText }" :ref="(el) => { infoDesktopRefs[index] = el as HTMLElement }">
                    <div class="text" v-for="content in item.items">
                        <h4>{{ content['sub-title'] }}</h4>
                        <p v-for="para in content.content">{{ para }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="mobile-info">
            <h2>How it works</h2>
            <div class="info-container" v-for="item, index in helpData.mobile">
                <div class="help__headline" @click="toggleTextMobile(index)">
                    <h3>{{ item.title }}</h3>
                    <font-awesome-icon icon="chevron-down" :class="{ 'display-text--active': index === activeText }" />
                </div>
                <div class="text-container" :class="{ 'info-active': index === activeText }" :ref="(el) => { infoRefs[index] = el as HTMLElement }">
                    <div class="text" v-for="content in item.items">
                        <h4>{{ content['sub-title'] }}</h4>
                        <p v-for="para in content.content">{{ para }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <AddList v-if="addOverlay" @click=" addOverlay = !addOverlay" :displayOverlay="addOverlay" />
</template>

<style scoped lang="scss">
    @import '@/views/help/help.scss';
</style>