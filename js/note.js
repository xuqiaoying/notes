(function () {

    let app = {

        LOCAL_STORAGE_KEY: 'notes',

        //用app对象的属性来存储DOM元素，this就是app
        init() {

            this.notes = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY)) || [];
            this.selectedIndex = null;
            this.$el = document.querySelector('.main');

            this.$el.addEventListener('click', this, false); //對象作為時間監聽器
            this.$main = this.$el.querySelector('.main_view');
            this.$main_edit = this.$el.querySelector('.main_edit');
            this.$notes = this.$el.querySelector('.notes');
            this.$edit = this.$el.querySelector('.edit');
            this.$check = this.$el.querySelector('.fa.fa-check');
            this.$bottom = this.$el.querySelector('.bottom');
            this.render();
        },

        handleEvent(evet) {
            let target = event.target;
            switch (true) {
                case target.matches('.back .fa.fa-exchange'):
                    this.home();
                    break;
                case target.matches('.front .fa.fa-exchange'):
                    this.setting();
                    break;
                case target.matches('.new') || target.parentElement.matches('.new'):
                    this.add();
                    break;
                case target.matches('.fa.fa-arrow-left'):
                    this.back(event);
                    break;
                case target.matches('.fa.fa-check'):
                    this.check();
                    break;
                case target.matches('.note'):
                    this.view(event);
                    break;
                case target.matches('.delete'):
                    this.trash();
                    break;
            }
        },

        //切回到主頁面
        home() {
            this.$main.classList.remove('flip');
            this.$main.classList.add('home');
        },

        //切回到設置頁面
        setting() {
            this.$main.classList.remove('home');
            this.$main.classList.add('flip');
        },

        //新建備忘錄
        add() {
            this.selectedIndex = null;
            this.$check.style.visibility = 'visible';
            this.$main_edit.classList.add('push');
            this.$bottom.style.visibility = 'hidden';
            this.$edit.value = '';
        },


        //查看当前备忘录
        view(event) {

            this.selectedIndex = event.target.dataset.index;
            //this.selectedIndex = event.target.getAttibute('data-index');
            this.$edit.value = this.notes[this.selectedIndex].text;
            this.$check.style.visibility = 'visible';
            this.$bottom.style.visibility = 'visible';
            this.$main_edit.classList.add('push');
        },
        //<- 返回主頁
        back(event) {

            this.$main_edit.classList.remove('push');
            this.$edit.value = '';
            // this.save();
            // this.render();
        },

        //点击√保存页面
        check() {
            if (this.selectedIndex === null && this.$edit.value.length > 0) {
                this.notes.push({ text: this.$edit.value });
            } else if( this.selectedIndex !== null && this.$edit.value.length === 0) {
                this.notes.splice(this.selectedIndex,1);
            } else {
                this.notes[this.selectedIndex].text = this.$edit.value;
            }

            this.$check.style.visibility = 'hidden';
            this.save();
            this.render();
        },

        //删除备忘录
        trash() {
            if(!confirm('是否删除此备忘录？')) return;
            this.notes.splice(this.selectedIndex,1);
            this.save();
            this.render();
            this.$main_edit.classList.remove('push');
        },

        //保存頁面
        save() {
            localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.notes));
        },

        //渲染列表
        render() {
            this.$notes.innerHTML = this.notes.map((note, i) => `<div class='note' data-index='${i}'>${note.text}</div>`).join('');
        },

    };

    document.addEventListener('DOMContentLoaded', function () {
        app.init();
    });

    window.app = app;
})();