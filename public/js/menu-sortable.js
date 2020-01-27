$(function(){
	
	var menu = $( ".menu-sortable" );
	var storage = menu.closest('.form-widget').find('textarea');
	var lastId = 0;

	//#### AJAX ####//
	var url = Routing.generate('getpages');
	$.get(url, function(data){
		var itemModal = new ItemModal(data);
		var itemMenu = new ItemMenu(data);
	});

	//#### ITEM MODAL ####//
	class ItemModal {

		constructor(pages) {
			this.modal = $('#menu-modal');
			this.customEl = this.modal.find('.menu-item-custom');
			this.newTabEl = this.modal.find('.menu-item-new-tab');
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
			this.newTabEl.click( function() { that.updateTarget($(this)); });
			this.titleEl.keyup( function() { that.updateTitle($(this)); } );
			this.hrefEl.keyup( function() { that.updateHref($(this)); });
			this.pageEl.change( function() { that.updatePage($(this)); });
			this.modal.on('show.bs.modal', function(e) { that.open(e); } );
			this.storeEl.click( () => that.store() );
		}

		open(e) {
			this.target = $(e.relatedTarget);
			this.add = this.target.data('add');
			if(this.add) { 
				this.id = lastId + 1;
				var firstOption = this.pageEl.find('option:first');
				this.title = firstOption.text();
				this.page = firstOption.val();
				this.custom = false;
				this.newTab = "_self";
				this.href = null;
			} else {
				this.id = parseInt(this.target.attr('id').replace('menu_', ""));
				this.title = this.target.data('name');
				this.page = this.target.data('page');
				this.custom = this.target.data('custom');
				this.newTab = this.target.attr('target');
				this.href = this.target.data('href');
			}

			this.customEl.prop('checked', this.custom);
			this.newTab == "_self" ? this.newTabEl.prop('checked', false) : this.newTabEl.prop('checked', true);
			this.titleEl.val(this.title);
			this.hrefEl.val(this.href);
			this.pageEl.val(this.page);
			this.updateCustom();
			this.updateTarget();
		}

		updateCustom(el = null) {
			if(el) {
				var checked = el.is(':checked');
				this.custom = checked;
			}
			this.configEl.find('[data-custom]').hide();
			this.configEl.find('[data-custom="' + this.custom + '"]').show();
		}

		updateTarget( el = null ) {
			if(el) {
				var checked = el.is(':checked');
				checked ? this.newTab = "_blank" : this.newTab = "_self";
			}
			this.configEl.find(':target').hide();
			this.configEl.find('[target="' + this.newTab + '"]').show();
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

		store() {
			var item = { 
				id: this.id, 
				name: this.title, 
				page: this.page,
				href : this.href,
				custom : this.custom,
				newTab : this.newTab 
			};
			this.add ? createItem(item) : editItem(this.target, item);
			storeMenuData();
		}

	}

	//#### MENU SORTABLE ####//

	class ItemMenu {

		constructor(parsed) {
			this.menu = menu;
			this.storage = storage;
			this.item = null;
			this.newItem = null;
			this.child = null;
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
			var data = this.storage.text();
			if(data == "") return;
				try{
					data = JSON.parse(data);
					for(var i=0; i<data.length; i++){

						this.item = data[i];
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
	}

	//#### FUNCTIONS ####//
	function storeMenuData(){
		var result = JSON.stringify(menu.nestedSortable('toHierarchy', { options : { attribute: "data-" } }));
		storage.text(result);
	}

	function createItem(item,  parent = null){
		var container = menu;
		if(parent && parent.length) {
			container = parent.find('ul');
			if(!container.length) { 
				container = $('<ul>');
				container.appendTo(parent);
			}
		}
		var newItem = $('<li id="menu_' + item.id + '" class="menu-item" target="' + item.newTab + '" data-href="' + item.href + '" data-custom="' + item.custom + '" data-page="' + item.page + '" data-name="' + item.name + '" data-toggle="modal" data-target="#menu-modal">' + item.name + '<i class="fas fa-times remove"></i></li>');
		newItem.appendTo(container);
		if(item.id>lastId) lastId = item.id;
		return newItem;
	}

	function editItem(el, item) {
		el.attr('id', 'menu_'+ item.id);
		el.data('href', item.href);
		el.data('page', item.page);
		el.data('name', item.name);
		el.data('custom', item.custom);
		el.attr('target', item.newTab);
		el.text(item.name);
	}

});