import { fetchDeadlockItemsRaw } from './src/hooks/deadlockApi';
(async () => {
  const items = await fetchDeadlockItemsRaw();
  const names = ['Juggernaut', 'Plated Armor', 'Suppressor'];
  for(const item of items) {
    if(item.name && names.includes(item.name)) {
      console.log('--- ' + item.name + ' ---');
      const props = item.properties || {};
      for(const [k, v] of Object.entries(props)) {
        console.log(k, v.value);
      }
    }
  }
})();
