import React, { useState, useCallback } from 'react';
import { PackageSearch, WifiOff, RefreshCw, Mail } from 'lucide-react';
import { createSelector } from "reselect";
import { useSelector } from "react-redux";

// Definición de tipos para TypeScript
type ProductData = {
  product_id: string;
  product_name: string;
  totalAmount: number;
  totalWeight: number;
};

type ProductsData = {
  [key: string]: ProductData;
};

type ProductsSaleCharts = {
  sale?: ProductsData;
  shop?: ProductsData;
};

type RootState = {
  TICKETManagment: {
    productsSaleCharts: ProductsSaleCharts;
    productImages: {
      [key: string]: {
        img: string;
      };
    };
  };
};

const MonthlyCampaign = () => {
  const selectDataList = createSelector(
    (state: RootState) => state.TICKETManagment,
    (state) => ({
      productsSaleCharts: state.productsSaleCharts || { sale: {}, shop: {} },
      productImages: state.productImages || {}
    })
  );

  const { productsSaleCharts, productImages } = useSelector(selectDataList);
  const [ticketType, setTicketType] = useState<'sale' | 'shop'>('sale');

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  const handleContact = useCallback(() => {
    window.open('mailto:soporte@nimbuscloud.mx?subject=Soporte%20-%20Historial%20mensual', '_blank');
  }, []);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const currentMonth = months[new Date().getMonth()];

  // Verificación mejorada de datos
  const currentData = productsSaleCharts[ticketType] || {};
  const hasData = Object.keys(currentData).length > 0;

  return (
    <div className="col-span-12 lg:col-span-6 order-[13] 2xl:order-1 card 2xl:col-span-3">
      <div className="card-body">
        <div className="flex w-full items-center justify-between mb-4">
          <h6 className="mb-3 text-15 font-medium">
            Histórico de {ticketType === 'sale' ? 'venta' : 'compra'} en {currentMonth}
          </h6>
          <button
            onClick={() => setTicketType(ticketType === 'sale' ? 'shop' : 'sale')}
            type="button"
            className="bg-white border-dashed text-sky-500 btn border-sky-500 hover:text-sky-500 hover:bg-sky-50 hover:border-sky-600 focus:text-sky-600 focus:bg-sky-50 focus:border-sky-600 active:text-sky-600 active:bg-sky-50 active:border-sky-600 dark:bg-zink-700 dark:ring-sky-400/20 dark:hover:bg-sky-800/20 dark:focus:bg-sky-800/20 dark:active:bg-sky-800/20"
          >
            <i className="align-baseline ltr:pr-1 rtl:pl-1 ri-refresh-line"></i>
            {ticketType === 'sale' ? 'Venta' : 'Compra'}
          </button>
        </div>

        <div className="h-80 overflow-y-auto flex items-center justify-center">
          {hasData ? (
            <div className="w-full">
              <ul className="flex flex-col gap-2">
                {Object.values(currentData).map((product) => (
                  <React.Fragment key={product.product_id}>
                    <li className="flex items-center gap-3 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-zinc-800 p-2 rounded-md">
                      <div className="flex items-center justify-center size-8 text-red-500 bg-red-100 rounded-md dark:bg-red-500/20 shrink-0">
                        {productImages[product.product_id] ? (
                          <img
                            className="size-10"
                            src={productImages[product.product_id].img}
                            alt={product.product_name || 'Producto'}
                          />
                        ) : (
                          <WifiOff className="size-5" />
                        )}
                      </div>
                      <h6 className="grow">{product.product_name}</h6>
                      <div className="flex flex-col items-end whitespace-nowrap text-right">
                        <p className="text-slate-500 dark:text-zink-200 text-sm">
                          $ {product.totalAmount?.toFixed(2)}
                        </p>
                        <p className="text-green-500 text-sm">
                          {product.totalWeight?.toFixed(2)} KG
                        </p>
                      </div>
                    </li>
                    <hr className="border-t border-gray-200 dark:border-zinc-700" />
                  </React.Fragment>
                ))}
              </ul>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center">
              <div className="flex flex-col items-center justify-center w-full max-w-[520px] p-4 sm:p-6 bg-white dark:bg-zinc-800 rounded-md shadow-sm border border-slate-100 dark:border-zinc-700">
                <PackageSearch size={52} className="text-slate-400 dark:text-slate-300 mb-3" />
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1 text-center">
                  Historial mensual — {ticketType === 'sale' ? 'venta' : 'compra'}
                </h3>
                <p className="text-sm sm:text-sm text-slate-500 dark:text-slate-400 text-center max-w-full sm:max-w-[460px] mb-4 px-3 sm:px-0">
                  Este apartado muestra el histórico por producto para {currentMonth}. Actualmente no se ha registrado información para este periodo.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto px-3 sm:px-0">
                  <button
                    type="button"
                    onClick={handleReload}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-2 rounded bg-sky-500 text-white hover:bg-sky-600"
                  >
                    <RefreshCw size={14} />
                    Recargar
                  </button>

                  <button
                    type="button"
                    onClick={handleContact}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-2 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <Mail size={14} />
                    Contactar Soporte
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyCampaign;