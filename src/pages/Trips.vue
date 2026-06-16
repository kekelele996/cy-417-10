<template>
  <main class="page">
    <h1>我的旅行</h1>
    <div class="toolbar">
      <el-button type="primary" @click="create">新建旅行</el-button>
      <el-button type="success" @click="selectDialogVisible = true">从模板新建</el-button>
      <el-select v-model="tripStore.statusFilter" style="width: 160px">
        <el-option label="全部状态" value="all" />
        <el-option v-for="item in TRIP_STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <EmptyState v-if="!tripStore.filteredTrips.length" title="还没有旅行计划" :description="messages.emptyTrips" />
    <section class="grid">
      <TripCard v-for="trip in tripStore.filteredTrips" :key="trip.id" :trip="trip" @open="open" @remove="tripStore.removeTrip" />
    </section>
    <TemplateSelectDialog v-model:visible="selectDialogVisible" @apply="createFromTemplate" />
  </main>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TripCard from '../components/common/TripCard.vue';
import EmptyState from '../components/common/EmptyState.vue';
import TemplateSelectDialog from '../components/common/TemplateSelectDialog.vue';
import { useTripStore } from '../stores/tripStore';
import { useDayPlanStore } from '../stores/dayPlanStore';
import { useTemplateStore } from '../stores/templateStore';
import { TRIP_STATUS_OPTIONS } from '../constants/trip';
import { messages } from '../constants/messages';
const router = useRouter();
const tripStore = useTripStore();
const dayPlanStore = useDayPlanStore();
const templateStore = useTemplateStore();
const selectDialogVisible = ref(false);
function create() { router.push('/trip/' + tripStore.createTrip()); }
function open(id: string) { router.push('/trip/' + id); }
function createFromTemplate(templateId: string) {
  const tpl = templateStore.templates.find((t) => t.id === templateId);
  if (!tpl) return;
  const tripId = tripStore.createTrip(undefined, tpl);
  const trip = tripStore.trips.find((t) => t.id === tripId);
  if (trip) {
    dayPlanStore.importFromTemplate(tripId, tpl, trip.start_date);
  }
  router.push('/trip/' + tripId);
}
</script>

