<template>
  <el-dialog v-model="visible" title="从模板新建" width="520px" @close="$emit('update:visible', false)">
    <EmptyState v-if="!templateStore.templates.length" title="暂无模板" :description="messages.emptyTemplates" />
    <div v-else class="template-list">
      <div
        v-for="tpl in templateStore.templates"
        :key="tpl.id"
        class="template-item"
        :class="{ selected: selectedId === tpl.id }"
        @click="selectedId = tpl.id"
      >
        <strong>{{ tpl.name }}</strong>
        <p class="muted">{{ tpl.destination }} · {{ tpl.days }}天 · {{ formatCurrency(tpl.budget, tpl.currency) }}</p>
        <p class="muted">{{ tpl.day_plans.reduce((s, d) => s + d.items.length, 0) }} 个景点安排</p>
        <el-button link type="danger" @click.stop="templateStore.removeTemplate(tpl.id)">删除</el-button>
      </div>
    </div>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" :disabled="!selectedId" @click="apply">套用模板</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useTemplateStore } from '../../stores/templateStore';
import { formatCurrency } from '../../utils/formatters';
import { messages } from '../../constants/messages';
import EmptyState from './EmptyState.vue';
defineProps<{ visible: boolean }>();
const emit = defineEmits<{ 'update:visible': [val: boolean]; apply: [templateId: string] }>();
const templateStore = useTemplateStore();
const selectedId = ref('');
function apply() {
  if (!selectedId.value) return;
  emit('apply', selectedId.value);
  selectedId.value = '';
  emit('update:visible', false);
}
</script>
<style scoped>
.template-list { display: flex; flex-direction: column; gap: 10px; max-height: 360px; overflow-y: auto; }
.template-item { border: 1px solid #dbe7cf; border-radius: 8px; padding: 14px; cursor: pointer; background: #fff; transition: border-color 0.2s; }
.template-item:hover { border-color: #2d7a46; }
.template-item.selected { border-color: #2d7a46; background: #f0f7f2; }
</style>
