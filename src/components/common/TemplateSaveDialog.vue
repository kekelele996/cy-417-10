<template>
  <el-dialog v-model="visible" title="保存为模板" width="460px" @close="$emit('update:visible', false)">
    <el-form label-width="80px">
      <el-form-item label="模板名称">
        <el-input v-model="name" placeholder="例如：杭州两日游" />
      </el-form-item>
      <el-form-item label="目的地">
        <el-input :model-value="trip.destination" disabled />
      </el-form-item>
      <el-form-item label="行程天数">
        <el-input :model-value="String(dayCount)" disabled />
      </el-form-item>
      <el-form-item label="预算基线">
        <el-input :model-value="formatCurrency(trip.budget, trip.currency)" disabled />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" :disabled="!name.trim()" @click="save">保存模板</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Trip } from '../../models/trip';
import type { DayPlan } from '../../models/dayPlan';
import { useTemplateStore } from '../../stores/templateStore';
import { useDayPlanStore } from '../../stores/dayPlanStore';
import { formatCurrency } from '../../utils/formatters';
const props = defineProps<{ visible: boolean; trip: Trip }>();
const emit = defineEmits<{ 'update:visible': [val: boolean]; saved: [] }>();
const templateStore = useTemplateStore();
const dayPlanStore = useDayPlanStore();
const name = ref('');
const dayCount = computed(() => dayPlanStore.dayPlans.filter((d) => d.trip_id === props.trip.id).length);
function save() {
  const days = dayPlanStore.dayPlans.filter((d) => d.trip_id === props.trip.id);
  templateStore.saveFromTrip(props.trip, days, name.value.trim());
  name.value = '';
  emit('update:visible', false);
  emit('saved');
}
</script>
