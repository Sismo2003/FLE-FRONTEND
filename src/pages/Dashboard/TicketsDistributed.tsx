import React, { useState, useCallback } from 'react';
import ReactApexChart from 'react-apexcharts';
import { BookDashed, RefreshCw, Mail } from 'lucide-react';
import { createSelector } from "reselect";
import { useSelector } from "react-redux";

// Definición de tipos 
type ProductData = {
  product_name: string;
  totalWeight: number;
};

type ChartData = {
  [key: string]: ProductData;
};

type ProductsSaleCharts = {
  sale?: ChartData;
  shop?: ChartData;
};

type RootState = {
  TICKETManagment: {
    productsSaleCharts: ProductsSaleCharts;
    loading: boolean;
  };
};

const DistributedChart = ({ chartId }: { chartId: string }) => {
  const selectDataList = createSelector(
    (state: RootState) => state.TICKETManagment,
    (state) => ({
      productsSaleCharts: state.productsSaleCharts || {},
      loading: state.loading,
    })
  );

  
  const { productsSaleCharts, loading } = useSelector(selectDataList);
  const [ticketType, setTicketType] = useState<'sale' | 'shop'>('sale');

  const handleReload = useCallback(() => {
    // Simple reload; if you have a redux action to refetch, replace this with that dispatch
    window.location.reload();
  }, []);

  const handleContact = useCallback(() => {
    // Change the email address to your actual support contact if available
    window.open('mailto:soporte@tuempresa.com?subject=Soporte%20-%20Tickets', '_blank');
  }, []);

  // Preparación de datos del gráfico
  const getChartData = () => {
    if (loading || !productsSaleCharts) return { series: [], options: null };

    const selectedData = ticketType === 'sale' 
      ? productsSaleCharts.sale 
      : productsSaleCharts.shop;

    if (!selectedData || Object.keys(selectedData).length === 0) {
      return { series: [], options: null };
    }

    const series = [{
      data: Object.values(selectedData).map((product) => ({
        x: product.product_name,
        y: product.totalWeight
      }))
    }];

    const options: ApexCharts.ApexOptions = {
      legend: { show: false },
      chart: {
        height: 350,
        type: 'treemap',
      },
      title: {
        text: ticketType === 'sale' 
          ? 'Total en kilogramos de venta de cada producto' 
          : 'Total en kilogramos de compra de cada producto',
        align: 'center' as const, // Aquí está el cambio clave
      },
      colors: [
        '#3B93A5', '#F7B844', '#ADD8C7', '#EC3C65', '#CDD7B6',
        '#C1F666', '#D43F97', '#1E5D8C', '#421243', '#7F94B0',
        '#EF6537', '#C0ADDB'
      ],
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false
        }
      }
    };

    return { series, options };
  };

  const { series, options } = getChartData();
  const hasData = series.length > 0 && options !== null;

  return (
    <div className="col-span-12 card 2xl:col-span-12">
      <div className="card-body p-0">
        {loading ? null : (
          hasData ? (
            <>
              <div className="flex w-full items-center justify-between mb-4">
                <button
                  onClick={() => setTicketType(ticketType === 'sale' ? 'shop' : 'sale')}
                  type="button"
                  className="bg-white border-dashed text-sky-500 btn border-sky-500 hover:text-sky-500 hover:bg-sky-50 hover:border-sky-600 focus:text-sky-600 focus:bg-sky-50 focus:border-sky-600 active:text-sky-600 active:bg-sky-50 active:border-sky-600 dark:bg-zink-700 dark:ring-sky-400/20 dark:hover:bg-sky-800/20 dark:focus:bg-sky-800/20 dark:active:bg-sky-800/20"
                >
                  <i className="align-baseline ltr:pr-1 rtl:pl-1 ri-refresh-line"></i>
                  {ticketType === 'sale' ? 'Venta' : 'Compra'}
                </button>
              </div>
              <ReactApexChart
                dir="ltr"
                options={options}
                series={series}
                id={chartId}
                className="apex-charts"
                height={350}
                type="treemap"
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <BookDashed size={56} className="mb-3 text-slate-400" />
              <h3 className="text-lg font-semibold mb-1">No hay datos disponibles</h3>
              <p className="text-sm text-slate-500 mb-4 max-w-[560px]">
                Este apartado muestra el total en kilogramos por producto (venta o compra) para el tipo seleccionado. Actualmente no se ha registrado información para mostrar en este gráfico.
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReload}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded bg-sky-500 text-white hover:bg-sky-600"
                >
                  <RefreshCw size={14} />
                  Recargar
                </button>

                <button
                  type="button"
                  onClick={handleContact}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <Mail size={14} />
                  Contactar Soporte
                </button>

                {/* No "Mostrar detalles" control per UX — keeping CTAs minimal and clear */}
              </div>
            
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DistributedChart;