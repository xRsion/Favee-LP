// イベントデータ（JSONファイルの代わりに直接埋め込み）
const EVENTS_DATA = {
    "events": [
        {
            "id": 1,
            "title": "Faveeがリリース！！",
            "category": "update",
            "status": "upcoming",
            "date": "7月4日",
            "dateSort": "2025-07-04",
            "icon": "🎊",
            "iconBg": "bg-blue-500",
            "description": "新機能・改善点：",
            "details": [
                "ポケットの中で推し活ができるアプリ『Favee』が2025年7月4日ついにリリース！！"
            ],
            "note": "7月31日までのダウンロードで3,000ポイントプレゼント！",
            "noteBg": "bg-blue-50",
            "noteColor": "text-blue-800"
        }
    ]
};

class ScheduleManager {
    constructor() {
        this.events = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        await this.loadEvents();
        this.renderEvents();
        this.setupFilters();
    }

    async loadEvents() {
        // 埋め込みデータを直接使用（CORSエラーを回避）
        this.events = EVENTS_DATA.events.sort((a, b) => new Date(a.dateSort) - new Date(b.dateSort));
        console.info('埋め込みイベントデータを読み込みました。');
    }

    renderEvents() {
        const container = document.getElementById('schedule-container');
        if (!container) return;

        const filteredEvents = this.currentFilter === 'all' 
            ? this.events 
            : this.events.filter(event => event.category === this.currentFilter);

        container.innerHTML = filteredEvents.map(event => this.createEventHTML(event)).join('');
        
        // アニメーション効果を追加
        this.addAnimations();
    }

    createEventHTML(event) {
        const categoryClasses = {
            update: 'category-update',
            event: 'category-event',
            collab: 'category-collab',
            maintenance: 'category-maintenance'
        };

        const statusClasses = {
            upcoming: 'status-upcoming',
            ongoing: 'status-ongoing',
            completed: 'status-completed'
        };

        const categoryLabels = {
            update: 'アップデート',
            event: 'イベント',
            collab: 'コラボ',
            maintenance: 'メンテナンス'
        };

        const statusLabels = {
            upcoming: '予定',
            ongoing: '開催中',
            completed: '終了'
        };

        const statusColors = {
            upcoming: 'bg-yellow-100 text-yellow-800',
            ongoing: 'bg-green-100 text-green-800',
            completed: 'bg-gray-100 text-gray-800'
        };

        const categoryColors = {
            update: 'bg-blue-100 text-blue-800',
            event: 'bg-red-100 text-red-800',
            collab: 'bg-green-100 text-green-800',
            maintenance: 'bg-yellow-100 text-yellow-800'
        };

        return `
            <div class="schedule-item flex items-start" data-category="${event.category}" data-status="${event.status}">
                <div class="relative flex-shrink-0 hidden sm:block">
                    <div class="w-12 h-12 sm:w-16 sm:h-16 ${event.iconBg} rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold shadow-lg ${event.animation || ''}">
                        ${event.icon}
                    </div>
                    ${event.badge ? `
                        <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${event.badgeBg} text-white text-xs px-2 py-1 rounded-full">
                            ${event.badge}
                        </div>
                    ` : ''}
                </div>
                <div class="sm:ml-8 md:ml-12 flex-1 min-w-0">
                    <div class="schedule-card bg-white rounded-xl p-4 sm:p-6 shadow-lg ${categoryClasses[event.category]} ${statusClasses[event.status]}">
                        <div class="flex flex-col sm:flex-row sm:items-start justify-between mb-3 sm:mb-4">
                            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-0 pr-0 sm:pr-4">
                                ${event.title}
                            </h3>
                            <div class="flex flex-wrap items-center gap-1 sm:gap-2 flex-shrink-0">
                                <span class="${categoryColors[event.category]} text-xs font-semibold px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                                    ${categoryLabels[event.category]}
                                </span>
                                <span class="${statusColors[event.status]} text-xs font-semibold px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                                    ${statusLabels[event.status]}
                                </span>
                            </div>
                        </div>
                        <div class="text-sm text-gray-600 mb-3 sm:mb-4">
                            📅 ${event.date}
                        </div>
                        <div class="space-y-2 mb-3 sm:mb-4">
                            <h4 class="font-semibold text-gray-800 text-sm sm:text-base">${event.description}</h4>
                            <ul class="text-sm text-gray-600 space-y-1 ml-2 sm:ml-4">
                                ${event.details.map(detail => `<li class="break-words">• ${detail}</li>`).join('')}
                            </ul>
                        </div>
                        ${event.note ? `
                            <div class="${event.noteBg} p-3 rounded-lg">
                                <p class="text-sm ${event.noteColor} break-words">
                                    ${event.note}
                                </p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // アクティブクラスを削除
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // クリックされたボタンにアクティブクラスを追加
                button.classList.add('active');

                this.currentFilter = button.getAttribute('data-filter');
                this.renderEvents();
            });
        });
    }

    addAnimations() {
        const scheduleItems = document.querySelectorAll('.schedule-item');
        scheduleItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease-in-out';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // 管理用メソッド
    addEvent(eventData) {
        const newEvent = {
            id: Math.max(...this.events.map(e => e.id)) + 1,
            ...eventData
        };
        this.events.push(newEvent);
        this.events.sort((a, b) => new Date(a.dateSort) - new Date(b.dateSort));
        this.renderEvents();
        return newEvent;
    }

    updateEvent(id, eventData) {
        const index = this.events.findIndex(event => event.id === id);
        if (index !== -1) {
            this.events[index] = { ...this.events[index], ...eventData };
            this.events.sort((a, b) => new Date(a.dateSort) - new Date(b.dateSort));
            this.renderEvents();
            return this.events[index];
        }
        return null;
    }

    deleteEvent(id) {
        const index = this.events.findIndex(event => event.id === id);
        if (index !== -1) {
            const deletedEvent = this.events.splice(index, 1)[0];
            this.renderEvents();
            return deletedEvent;
        }
        return null;
    }

    // JSONデータをエクスポート（管理用）
    exportEvents() {
        return JSON.stringify({ events: this.events }, null, 2);
    }

    // JSONデータをインポート（管理用）
    async importEvents(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.events && Array.isArray(data.events)) {
                this.events = data.events.sort((a, b) => new Date(a.dateSort) - new Date(b.dateSort));
                this.renderEvents();
                return true;
            }
        } catch (error) {
            console.error('JSONデータのインポートに失敗しました:', error);
        }
        return false;
    }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
    window.scheduleManager = new ScheduleManager();
});

// 開発者用のコンソール関数
window.addEvent = (eventData) => window.scheduleManager?.addEvent(eventData);
window.updateEvent = (id, eventData) => window.scheduleManager?.updateEvent(id, eventData);
window.deleteEvent = (id) => window.scheduleManager?.deleteEvent(id);
window.exportEvents = () => window.scheduleManager?.exportEvents();
window.importEvents = (jsonData) => window.scheduleManager?.importEvents(jsonData);