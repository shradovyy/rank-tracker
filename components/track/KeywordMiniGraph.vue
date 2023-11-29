<template>
    <client-only>
        <apexchart type="area" height="50" :options="options" :series="series"></apexchart>
    </client-only>
</template>

<script>

    export default {
       
        props: ['height', 'width', 'chart', 'series', 'labels', 'labelFormat', 'sparkline', 'yLabelFormat'],
        data() {
            return {
                options: {
                    
                    chart: {
                        animations: {
                            enabled: false,
                        },
                        toolbar: {
                            show: false
                        },
                        zoom: {
                            enabled: false
                        },
                        sparkline: {
                            enabled: true
                        },
                    },
                    tooltip: {
                        enabled: false
                    },
                    plotOptions: { area: { fillTo: 'end' } },
                    yaxis: {
                        reversed: true,
                        show: false
                    },
                    markers: {
                        size: 0,
                    },
                    legend: {
                        show: false
                    },
                    stroke: {
                        width: 2,
                        colors: ['#5864FF'],
                        curve: 'straight'
                    },
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.chart {
    width: 100%;
}
</style>