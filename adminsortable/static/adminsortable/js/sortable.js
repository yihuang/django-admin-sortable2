jQuery(function($) {
	var sortable_update_url = $('#adminsortable_update_url').attr('href');
	var startorder, endorder;
	$('#result_list').sortable({
		handle: 'div.drag',
		items: 'tr',
		axis: 'y',
		scroll: true,
		cursor: 'ns-resize',
		containment: $('#result_list tbody'),
		start: function(event, dragged_rows) {
			$(this).find('thead tr th').each(function(index) {
				$(dragged_rows.item.context.childNodes[index]).width($(this).width() - 10);
			});
			startorder = $(dragged_rows.item.context).find('div.drag').attr('order');
		},
		stop: function(event, dragged_rows) {
			var $result_list = $(this);
			$result_list.find('tbody tr').each(function(index) {
				$(this).removeClass('row1 row2').addClass(index % 2 ? 'row2' : 'row1');
			}).each(function() {
				if (startorder === $(this).find('div.drag').attr('order')) {
					return false;
				} else {
					endorder = $(this).find('div.drag').attr('order');
				}
			});
			$.ajax(sortable_update_url, {
				type: 'POST',
				data: {
					startorder: startorder,
					endorder: endorder
				},
				success: function(moved_items) {
					$.each(moved_items, function(index, item) {
						$result_list.find('tbody tr input.action-select[value=' + item.pk + ']').parents('tr').each(function() {
							$(this).find('div.drag').attr('order', item.order);
						});
					});
				}
			});
		}
	});
	$('#result_list, tbody, tr, td, th').disableSelection();
});
