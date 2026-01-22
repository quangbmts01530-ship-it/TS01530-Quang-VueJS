<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script>
    const { createApp, ref, computed } = Vue;

    createApp({
        setup() {
            // 1. Khai báo biến (ref)
            const yearOfBirth = ref('');
            const currentYear = new Date().getFullYear();

            // 2. Tính tuổi (computed)
            const age = computed(() => {
                if (!yearOfBirth.value) return null;
                const year = parseInt(yearOfBirth.value);
                // Kiểm tra năm hợp lệ
                if (isNaN(year) || year < 1900 || year > currentYear) return null;
                return currentYear - year;
            });

            // 3. Phân loại (computed) đúng theo ảnh bạn gửi
            const ageCategory = computed(() => {
                if (age.value === null) return '';

                if (age.value < 12) {
                    return 'Trẻ em';
                } else if (age.value < 18) {
                    return 'Thiếu niên';
                } else if (age.value < 40) {
                    return 'Thanh niên';
                } else if (age.value < 60) {
                    return 'Trung niên';
                } else {
                    return 'Lớn tuổi';
                }
            });

            // Trả về để Template sử dụng
            return {
                yearOfBirth,
                age,
                ageCategory
            }
        }
    }).mount('#app');
</script>