$(function(){
	//#### AJAX ####//
	var url = Routing.generate('getpages');
	$.get(url, function(data){
		var menuSortable = new MenuSortable(data);
		new ItemModal(data, menuSortable);
	});

	//#### ITEM MODAL ####//
	class ItemModal {

		constructor(pages, menuSortable) {
			this.menuSortable = menuSortable;
			this.modal = $('#menu-modal');
			this.customEl = this.modal.find('.menu-item-custom');
			this.tabEl = this.modal.find('.menu-item-new-tab');
			this.titleEl = this.modal.find('.menu-item-title');
			this.hrefEl = this.modal.find('.menu-item-href');
			this.pageEl = this.modal.find('.menu-item-page');
			this.storeEl = this.modal.find('#btn-save');
			this.configEl = this.modal.find('.menu-item-config');
			this.initPageList(pages);
			this.initEvents();
		}

		initPageList(pages){
			for( var page in pages ){
				$('<option value="' + page + '">' + pages[page] + '</option>').appendTo(this.pageEl);
			} 
		}

		initEvents() {
			var that = this;

			this.customEl.click( function() { that.updateCustom($(this)); });
			this.tabEl.click( function() { that.updateTarget($(this)); });
			this.titleEl.keyup( function() { that.updateTitle($(this)); } );
			this.hrefEl.keyup( function() { that.updateHref($(this)); });
			this.pageEl.change( function() { that.updatePage($(this)); });
			this.modal.on('show.bs.modal', function(e) { that.open(e); } );
			this.storeEl.click( () => that.store() );
		}

		open(e) {
			this.target = $(e.relatedTarget).closest('.menu-item');
			this.add = this.target.length == false;
			if(this.add) { 
				this.id = this.menuSortable.lastId + 1;
				var firstOption = this.pageEl.find('option:first');
				this.title = firstOption.text();
				this.page = firstOption.val();
				this.custom = false;
				this.tab = false;
				this.href = null;
			} else {
				this.id = parseInt(this.target.attr('id').replace('menu_', ""));
				this.title = this.target.data('name');
				this.page = this.target.data('page');
				this.custom = this.target.data('custom');
				this.tab = this.target.data('target');
				this.href = this.target.data('href');
			}

			this.customEl.prop('checked', this.custom);
			!this.tab ? this.tabEl.prop('checked', false) : this.tabEl.prop('checked', true);
			this.titleEl.val(this.title);
			this.hrefEl.val(this.href);
			this.pageEl.val(this.page);
			this.updateCustom();
		}

		updateCustom(el = null) {
			if(el) {
				var checked = el.is(':checked');
				this.custom = checked;
			}
			this.configEl.find('[data-custom]').hide();
			this.configEl.find('[data-custom="' + this.custom + '"]').show();
		}

		updateTarget(el) {
			var checked = el.is(':checked');
			checked ? this.tab = true : this.tab = false;
		}

		updateTitle(el) {
			this.title = el.val();
		}

		updateHref(el) {
			this.href = el.val();
		}

		updatePage(el) {
			this.page = el.val();
			this.title = el.find(':selected').text();
		}

		editItem(el, item) {
			el.attr('id', 'menu_'+ item.id);
			el.data('href', item.href);
			el.data('page', item.page);
			el.data('name', item.name);
			el.data('custom', item.custom);
			el.data('tab', item.tab);
			el.find('.menu-item-text').text(item.name);
		}

		store() {
			var item = { 
				id: this.id, 
				name: this.title, 
				page: this.page,
				href : this.href,
				custom : this.custom,
				tab : this.tab 
			};
			this.add ? this.menuSortable.createItem(item) : this.editItem(this.target, item);
			this.menuSortable.storeMenuData();
		}

	}

	//#### MENU SORTABLE ####//
	class MenuSortable {

		constructor(loadedData) {
			this.loadedData = loadedData;
			this.menu = $( ".menu-sortable" );
			this.storage = this.menu.closest('.form-widget').find('textarea');
			this.lastId = 0;
			this.initMenu();
			this.loadMenuData();
		}

		initMenu() {
			var that = this;

			this.menu.nestedSortable({
				listType: "ul",
				items: ".menu-item",
				maxLevels: 2,
				stop: () => that.storeMenuData()
			});

			this.menu.delegate('.remove','click', function(){
				$(this).closest('.menu-item').remove();
				that.storeMenuData();
			});
		}

		createItem(item,  parent = null){
			var container = this.menu;
			if(parent && parent.length) {
				container = parent.find('ul');
				if(!container.length) { 
					container = $('<ul>');
					container.appendTo(parent);
				}
			}
			var editBtn = $('<a href="#" data-toggle="modal" data-target="#menu-modal">Edit</a>');
			var textItem = $('<span class="menu-item-text">' + item.name + '</span>');
			var newItem = $('<li id="menu_' + item.id + '" class="menu-item">');
			newItem.data('href', item.href);
			newItem.data('custom', item.custom);
			newItem.data('page', item.page);
			newItem.data('name', item.name);
			newItem.data('tab', item.tab);
			newItem.append(textItem);
			newItem.append(editBtn);
			newItem.appendTo(container);
			if(item.id>this.lastId) this.lastId = item.id;
			return newItem;
		}

		storeMenuData(){
			var result = this.menu.nestedSortable('toHierarchy', { 
				options : { attribute: "data-" } 
			});
			result = JSON.stringify(result);
			this.storage.text(result);
		}

		createFromData(item, parent = null) {
			if( !item.custom ){
				if( item.page in this.loadedData == false ) return false;
				item.name = this.loadedData[item.page];
			}
			return this.createItem( item, parent );
		}

		loadMenuData(){
			var data = this.storage.text();
			if(data == "") return;
				try{
					data = JSON.parse(data);
					for(var i=0; i<data.length; i++){
						var item = data[i];
						var newItem = this.createFromData( item );
						if( newItem && 'children' in item ){
							for(var n=0; n<item.children.length; n++){
								this.createFromData( item.children[n], newItem );
							}
						}

					}
				} catch(e) { console.warn('Error while parsing JSON : ' + e.message ) }
		}
	}

});