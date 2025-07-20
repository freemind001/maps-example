ymaps.ready(function() {
    var map = new ymaps.Map('map', {
        center: [56.812980, 60.579667],
        zoom: 18,
        controls: []
    });
    var multiRoute;

    new ymaps.SuggestView('from');
    new ymaps.SuggestView('to');
    
    document.getElementById('add-via').addEventListener('click', function(e) {
        e.preventDefault();
        const viaList = document.getElementById('via-list');

        const viaGroup = document.createElement('div');
        viaGroup.className = 'via-group';

        const viaInput = document.createElement('input');
        viaInput.type = 'text';
        viaInput.placeholder = `Через:`;
        viaInput.className = 'via-input';
        viaInput.autocomplete = 'off'

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = '✖';
        deleteBtn.className = 'via-remove';
        deleteBtn.title = 'Удалить точку';

        viaGroup.appendChild(viaInput);
        viaGroup.appendChild(deleteBtn);
        viaList.appendChild(viaGroup);

        new ymaps.SuggestView(viaInput);

        viaGroup.querySelector('.via-remove').addEventListener('click', function() {
            viaGroup.remove();
        });
    });

    // построение маршрута
    document.getElementById('build-route').addEventListener('click', function() {
        const from = document.getElementById('from').value.trim();
        const to = document.getElementById('to').value.trim();
        if (!from || !to) {
            alert('Введите начальную и конечную точку маршрута');
            return;
        }
        // собираем промежуточные точки
        const viaInputs = document.querySelectorAll('#via-list input');
        const viaPoints = [];
        viaInputs.forEach(i => {
            if (i.value.trim()) viaPoints.push(i.value.trim());
        });

        const referencePoints = [from].concat(viaPoints).concat([to]);

        if (multiRoute) map.geoObjects.remove(multiRoute);

        // создаём новый мультимаршрут
        multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: referencePoints,
            params: { routingMode: 'auto' }
        }, {
            routeActiveStrokeWidth: 6,
            routeActiveStrokeColor: "#2222ff",
        });
        map.geoObjects.add(multiRoute);

        multiRoute.model.events.add('requestsuccess', function() {
            var activeRoute = multiRoute.getActiveRoute();
            if (activeRoute) {
                var bounds = activeRoute.getBounds();
                if (bounds) {
                    map.setBounds(bounds, { checkZoomRange: true, margin: 40 });
                }
            }
        });
    });
});