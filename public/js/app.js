const { createApp } = Vue;
const BASE_URL = window.location.origin;

createApp({
    data() {
        return {
            users: [],
            allUsers: [],
            totalUsers: 0,
            totalPages: 0,
            page: 1,
            limit: 10,
            search: '',
            searchTimer: null,

            form: { name: '', email: '', phone: '', password: '' },
            editId: null,

            loginForm: { email: '', password: '' },
            loginMessage: '',
            isLogin: true,
            isLoggedIn: false,

            exportType: '',
            filterType: 'all',

            showModal: false,
            chart: null,
        };
    },

    methods: {
        async login() {
            try {
                const res = await fetch(`${BASE_URL}/api/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.loginForm)
                });
                const result = await res.json();

                if (!res.ok) {
                    this.loginMessage = result.message || 'Email atau password salah.';
                    return;
                }

                localStorage.setItem('token', result.token);
                this.isLoggedIn = true;
                this.loginMessage = '';
                this.$nextTick(() => {
                    this.getUsers();
                    this.getAllUsers();
                });
            } catch {
                this.loginMessage = 'Gagal terhubung ke server.';
            }
        },

        logout() {
            localStorage.removeItem('token');
            this.isLoggedIn = false;
            this.users = [];
            this.allUsers = [];
            this.loginForm = { email: '', password: '' };
            this.loginMessage = '';
            if (this.chart) { this.chart.destroy(); this.chart = null; }
        },

        async getUsers() {
            try {
                const params = new URLSearchParams({ page: this.page, limit: this.limit, search: this.search });
                const res = await fetch(`${BASE_URL}/api/users?${params}`);
                const data = await res.json();
                this.users = data.users;
                this.totalUsers = data.total;
                this.totalPages = data.totalPages;
            } catch (err) { console.error(err); }
        },

        async getAllUsers() {
            try {
                const res = await fetch(`${BASE_URL}/api/users/all`);
                this.allUsers = await res.json();
                this.$nextTick(() => this.renderChart());
            } catch (err) { console.error(err); }
        },

        changePage(p) {
            if (p < 1 || p > this.totalPages) return;
            this.page = p;
            this.getUsers();
        },

        onSearch() {
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => { this.page = 1; this.getUsers(); }, 400);
        },

        openEdit(user) {
            this.editId = user.id;
            this.form = { name: user.name, email: user.email, phone: user.phone };
            this.showModal = true;
        },

        async saveUser() {
            try {
                const url = this.editId
                    ? `${BASE_URL}/api/users/update/${this.editId}`
                    : `${BASE_URL}/api/users`;

                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(this.form)
                });

                if (!res.ok) throw new Error();

                this.showModal = false;
                this.editId = null;
                this.form = { name: '', email: '', phone: '', password: '' };

                if (!this.isLoggedIn) {
                    this.isLogin = true;
                    this.loginMessage = 'Registrasi berhasil. Silakan masuk.';
                } else {
                    this.getUsers();
                    this.getAllUsers();
                }
            } catch {
                alert('Gagal menyimpan data.');
            }
        },

        async deleteUser(id) {
            if (!confirm('Hapus pengguna ini?')) return;
            try {
                await fetch(`${BASE_URL}/api/users/${id}`, { method: 'DELETE' });
                this.getUsers();
                this.getAllUsers();
            } catch (err) { console.error(err); }
        },

        renderChart() {
            const ctx = document.getElementById('userChart');
            if (!ctx) return;
            if (this.chart) this.chart.destroy();

            const count = {};
            this.allUsers.forEach(u => {
                const d = u.email.split('@')[1] || 'lainnya';
                count[d] = (count[d] || 0) + 1;
            });

            this.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(count),
                    datasets: [{ label: 'Pengguna', data: Object.values(count), backgroundColor: '#2563eb', borderRadius: 4 }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: '#f3f4f6' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        },

        async exportData() {
            if (!this.exportType) return;

            // Jika allUsers belum ter-load, fetch dulu
            if (this.allUsers.length === 0) {
                try {
                    const res = await fetch(`${BASE_URL}/api/users/all`);
                    this.allUsers = await res.json();
                } catch {
                    alert('Gagal mengambil data untuk diekspor.');
                    return;
                }
            }

            let data = [...this.allUsers];
            if (this.filterType === 'gmail') data = data.filter(u => u.email.endsWith('@gmail.com'));
            else if (this.filterType === 'other') data = data.filter(u => !u.email.endsWith('@gmail.com'));

            if (!data.length) { alert('Tidak ada data sesuai filter yang dipilih.'); return; }

            const ts = Date.now();
            if (this.exportType === 'json') {
                this.download(JSON.stringify(data, null, 2), `users_${ts}.json`, 'application/json');
            } else if (this.exportType === 'csv') {
                const rows = ['id,name,email,phone', ...data.map(u => `${u.id},"${u.name}","${u.email}","${u.phone}"`)];
                this.download(rows.join('\n'), `users_${ts}.csv`, 'text/csv');
            } else if (this.exportType === 'txt') {
                this.download(data.map(u => `${u.id} | ${u.name} | ${u.email} | ${u.phone}`).join('\n'), `users_${ts}.txt`, 'text/plain');
            }
            this.exportType = '';
        },

        download(content, name, type) {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([content], { type }));
            a.download = name;
            a.click();
        }
    },

    mounted() {
        if (localStorage.getItem('token')) {
            this.isLoggedIn = true;
            this.$nextTick(() => { this.getUsers(); this.getAllUsers(); });
        }
    }
}).mount('#app');
