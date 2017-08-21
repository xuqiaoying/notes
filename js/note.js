(function () {

    let app = {

        LOCAL_STORAGE_KEY: 'notes',
        LOCAL_STORAGE_MODE:'mode',

        //用app对象的属性来存储DOM元素，this就是app
        init() {
            if (!localStorage.getItem(this.LOCAL_STORAGE_KEY)) { localStorage.setItem(this.LOCAL_STORAGE_KEY, '[]') };//处理本地数据为空等异常情况
            this.notes = Array.isArray(JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY))) ? JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY)) : [];
            this.mode = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_MODE)) || 1;

            this.selectedIndex = null;
            //this.mode = 1;
            this.$el = document.querySelector('.main');

            this.$el.addEventListener('click', this); //對象作為事件監聽器
            this.$main = this.$el.querySelector('.main_view');
            this.$main_edit = this.$el.querySelector('.main_edit');
            this.$notes = this.$el.querySelector('.notes');
            this.$edit = this.$el.querySelector('.edit');
            this.$check = this.$el.querySelector('.fa.fa-check');
            this.$bottom = this.$el.querySelector('.bottom');
            this.$more = this.$el.querySelector('.more');
            this.$nav = this.$el.querySelector('.nav');
            this.$list = this.$el.querySelector('.fa.fa-list-ul');
            this.$large = this.$el.querySelector('.fa.fa-th-large');
            this.$note = this.$el.querySelector('.note');
            if(this.mode ===2){
                this.$notes.classList.add('notesone');
                this.$list.style.display= 'none';
                this.$large.style.display= 'block';
            }
            this.render();

        },

        handleEvent(evet) {
            let target = event.target;
            if (target !== app.$nav && target !== app.$more && target.parentElement !== app.$more) {
                app.$nav.classList.remove('show');
            }
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
                case target.matches('.edit'):
                    this.edit();
                    break;
                case target.matches('.more') || target.parentElement.matches('.more'):
                    this.more();
                    break;
                case target.matches('.fa.fa-list-ul'):
                    this.list();
                    break;
                case target.matches('.fa.fa-th-large'):
                    this.large();
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
            this.edit();
            this.render();
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
        },

        //点击√保存页面
        check() {
            if (this.selectedIndex === null && this.$edit.value.length > 0) {
                this.notes.push({ text: this.$edit.value });
                this.selectedIndex = this.notes.length - 1;
            } else if (this.selectedIndex !== null && this.$edit.value.length === 0) {
                this.notes.splice(this.selectedIndex, 1);
            } else {
                this.notes[this.selectedIndex].text = this.$edit.value;
            }

            this.$check.style.visibility = 'hidden';
            this.save();
            this.render();
        },

        //点击edit的时候√出现
        edit() {
            this.$edit.focus();
            this.$edit.addEventListener('keyup', function () {
                if (app.selectedIndex !== null) {
                    if (app.notes[app.selectedIndex].text === app.$edit.value) {
                        app.$check.style.visibility = 'hidden';
                    } else {
                        app.$check.style.visibility = 'visible';
                    }
                }
            });
        },

        //点击更多的时候弹出对话框，点击其他地方的时候对话框消失
        more() {
            app.$nav.classList.toggle('show');

            // if (app.$nav.style.display == 'none') {
            //     app.$nav.style.display = 'block';
            // } else {
            //     app.$nav.style.display = 'none';
            // }
        },
        //用if的時候要在html对应的nav裡面加style="display:none" ，不能再css裡面加，如果加載css裡面會第一次点击的時候會沒反应第二次才有出來

        list() {
            this.$large.style.display = 'block';
            this.$list.style.display = 'none';
            this.$notes.classList.toggle('notesone');
            //this.$note.classList.toggle('note1');
            this.$notes.querySelectorAll('.note').forEach(function (note) {
                note.classList.add('note1');
            });
            this.mode = 2;
            this.save();
        },

        large() {
            this.$large.style.display = 'none';
            this.$list.style.display = 'block';
            this.$notes.classList.remove('notesone');
            //this.$note.classList.remove('note1');
            this.$notes.querySelectorAll('.note').forEach(function (note) {
                note.classList.remove('note1');
            });
            this.mode = 1;
            this.save();
        },

        //删除备忘录
        trash() {
            if (!confirm('是否删除此备忘录？')) return;
            this.notes.splice(this.selectedIndex, 1);
            this.$main_edit.classList.remove('push');
            this.save();
            this.render();
        },

        //保存頁面
        save() {
            localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.notes));
            localStorage.setItem(this.LOCAL_STORAGE_MODE, JSON.stringify(this.mode));
        },

        //渲染列表
        render() {
            this.$notes.innerHTML = this.notes.map( (note, i) =>{
                if (this.mode === 1) {
                    return `<div class='note' data-index='${i}'>${note.text}</div>`;
                } else {
                    return `<div class='note note1' data-index='${i}'>${note.text}</div>`;
                }
            }).join('');


            // if(this.$notes.classList.contains('notesone')){
            //     this.$notes.querySelectorAll('.note').forEach(function(note){
            //         note.classList.add('note1');
            //     })
            // }
        },
    };

    document.addEventListener('DOMContentLoaded', function () {
        app.init();
    });
    window.app = app;
})();

