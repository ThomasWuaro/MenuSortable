$(function(){

	class ItemMenu {

		constructor(parsed) {
			this.menu = $( ".menu-sortable" );
			this.item = null;
			this.newItem = null;
			this.child = null;
			this.storageEl = this.menu.closest('.form-widget').find('textarea');
			this.data = this.storageEl.text();
			this.btnAddEl = $("#btn-add-item");
			this.btnSaveEl = $('#btn-save');
			this.lastId = 0;
			this.initMenu();
			this.loadMenuData(parsed);
		}

		initMenu() {
			this.menu.nestedSortable({
				listType: "ul",
				items: ".menu-item",
				maxLevels: 2,
				stop: () => storeMenuData()
			});

			this.menu.delegate('.remove','click', function(){
				$(this).closest('.menu-item').remove();
				storeMenuData();
			});
		}

		loadMenuData(parsed){
		if(this.data == "") return;
			try{
				this.data = JSON.parse(this.data);
				for(var i=0; i<this.data.length; i++){

					this.item = this.data[i];
					if(!this.item.custom){
						if(this.item.page in parsed == false) continue;
						this.item.name = parsed[this.item.page];
					}
					this.newItem = createItem(this.item);

					if('children' in this.item ){
						for(var n=0; n<this.item.children.length; n++){
							this.child = this.item.children[n];
							if(!this.child.custom){
								if(this.child.page in parsed == false) continue;
								this.child.name = parsed[child.page];
							}
							createItem(this.child, this.newItem );
						}
					}
				}
			} catch(e) { console.warn('Error while parsing JSON : ' + e.message ) }
		}

		createItem(item,  parent = null){
			if(parent && parent.length) {
				this.menu = parent.find('ul');
				if(!this.menu.length) { 
					this.menu = $('<ul>');
					this.menu.appendTo(parent);
				}
			}
			this.newItem = $('<li id="menu_' + item.id + '" class="menu-item" target="' + item.newTab + '" data-href="' + item.href + '" data-custom="' + item.custom + '" data-page="' + item.page + '" data-name="' + item.name + '" data-toggle="modal" data-target="#menu-modal">' + item.name + '<i class="fas fa-times remove"></i></li>');
			this.newItem.appendTo(this.menu);
			if(item.id>this.lastId) this.lastId = item.id;
			return this.newItem;
		}

		editItem(el, item) {
			el.attr('id', 'menu_'+ item.id);
			el.data('href', item.href);
			el.data('page', item.page);
			el.data('name', item.name);
			el.data('custom', item.custom);
			el.attr('target', item.newTab);
			el.text(item.name);
		}

	}

});