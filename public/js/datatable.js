export function buildDataTable() {
    $.fn.dataTable.ext.type.detect.unshift(
        function ( sortByPriority ) {
            return (sortByPriority === 'Low' || sortByPriority === 'Medium' || sortByPriority === 'High' || sortByPriority === 'Critical') ?
                'ticket-priority' :
                null;
        }
    );

    $.fn.dataTable.ext.type.order['ticket-priority-pre'] = function ( sortByPriority ) {
        switch ( sortByPriority ) {
            case 'Low'      :   return 1;
            case 'Medium'   :   return 2;
            case 'High'     :   return 3;
            case 'Critical' :   return 4;
        }
        return 0;
    };

    $.fn.dataTable.ext.type.detect.unshift(
        function ( sortByType ) {
            return (sortByType === 'Bug' || sortByType === 'Issue' || sortByType === 'Feature Request') ?
                'ticket-type' :
                null;
        }
    );

    $.fn.dataTable.ext.type.order['ticket-type-pre'] = function ( sortByType ) {
        switch ( sortByType ) {
            case 'Bug'                 :   return 1;
            case 'Issue'               :   return 2;
            case 'Feature Request'     :   return 3;
        }
        return 0;
    };
    
    $.fn.dataTable.ext.type.detect.unshift(
        function ( sortbyStatus ) {
            return (sortbyStatus === 'New' || sortbyStatus === 'In Progress' || sortbyStatus === 'Resolved') ?
                'ticket-status' :
                null;
        }
    );
    
    $.fn.dataTable.ext.type.order['ticket-status-pre'] = function ( sortbyStatus ) {
        switch ( sortbyStatus ) {
            case 'New'          :   return 1;
            case 'In Progress'  :   return 2;
            case 'Resolved'     :   return 3;
        }
        return 0;
    };

    var table = $('#ticketTable').DataTable({
        "columnDefs": [ {
            "type": "ticket-priority",
            "targets": 2
        },
        {
            "type": "ticket-type",
            "targets": 3
        },
        {
            "type": "ticket-status",
            "targets": 5
        } ]
    });
}