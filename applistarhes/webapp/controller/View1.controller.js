sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/BusyIndicator",
    "../utils/formatter"
], function (Controller, UIComponent, MessageToast, JSONModel, Filter, FilterOperator, BusyIndicator,formatter) {
    "use strict";

    return Controller.extend("app.hes.applistarhes.controller.View1", {
        formatter: formatter,
        onInit: function () {
            this.getOwnerComponent().getModel().attachMetadataLoaded(null, function() {
                console.log("Modelo OData cargado correctamente.");
            }, this);
        
            // Intentar forzar la carga del modelo en la vista
            const oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel);
            
             // Crear modelo JSON para filtros, incluyendo fechas
                const oFilterModel = new JSONModel({
                    Serviceentrysheet: "",
                    PurchaseOrder: "",
                    Status: "",
                    ExternalNumber: "",
                    StartDate: "",
                    EndDate: "",
                    CreationDate : new Date().toISOString().split("T")[0]
                });
            this.getView().setModel(oFilterModel, "filters");

            // **Crear el modelo JSON para almacenar los datos de HES**
            const oViewModel = new JSONModel({
                HESDocuments: [] // Se inicializa vacío
            });
            this.getView().setModel(oViewModel, "viewModel");
            sap.ui.getCore().setModel(oModel, "viewModel");

            // Cargar los datos iniciales
            this._loadHESDocuments();

         
        },
        

        // _loadHESDocuments: function () {
        //     const oTable = this.byId("idHesTable");
        //     const oBinding = oTable.getBinding("items");

        //     if (oBinding) {
        //         oBinding.refresh();
        //     }
        // },
      
        _loadHESDocuments: function () {
            const oModelCore = sap.ui.getCore().getModel("viewModel");
            const oModel = this.getView().getModel();
            const oViewModel = this.getView().getModel("viewModel");
        
            if (!oModel) {
                console.error("El modelo OData no está disponible.");
                return;
            }
        
            // 🔹 Mostrar BusyIndicator
            BusyIndicator.show(0);
        
            // 🔹 Calcular la fecha de hoy y los últimos 60 días
            const today = new Date();
            const sTodayFormatted = today.toISOString().split("T")[0] + "T23:59:59"; // Hoy hasta las 23:59:59
        
            const pastDate = new Date();
            pastDate.setDate(today.getDate() - 60); // Últimos 60 días
            const sPastFormatted = pastDate.toISOString().split("T")[0] + "T00:00:00"; // Inicio del día
        
            // 🔹 Crear filtro OData para:
            //    - `Creationdatetime` dentro del rango de 30 días
            //    - `Rejectedstatus` vacío (eq '')
            //    - `Deletedstatus` vacío (eq '')
            const sFilter = `Creationdatetime ge datetime'${sPastFormatted}' and Creationdatetime le datetime'${sTodayFormatted}' and Rejectedstatus eq '' and Deletedstatus eq ''`;
            const sExpand = "navHesToHesItems";
        
            // 🔹 Llamar al servicio OData con el filtro de fechas y exclusión de estados
            oModel.read("/ServiceEntrySheetSet", {
                urlParameters: {
                    "$filter": sFilter,
                    "$expand": sExpand
                },
                success: function (oData) {
                    console.log("Datos obtenidos correctamente:", oData);
        
                    // 🔹 Guardar los datos en el modelo de vista
                    oViewModel.setProperty("/HESDocuments", oData.results);
                    oModelCore.setProperty("/HESDocuments", oData.results);
        
                    // 🔹 Ocultar BusyIndicator
                    BusyIndicator.hide();
                },
                error: function (oError) {
                    console.error("Error al obtener los datos:", oError);
        
                    // 🔹 Ocultar BusyIndicator en caso de error
                    BusyIndicator.hide();
                }
            });
        },
        
        
        _loadHESDocuments2: function () {
          //  const oModelCore = this.getOwnerComponent().getModel();
            const oModelCore = sap.ui.getCore().getModel("viewModel");

            const oModel = this.getView().getModel();
            const oViewModel = this.getView().getModel("viewModel");
        
            if (!oModel) {
                console.error("El modelo OData no está disponible.");
                return;
            }
        
            // Mostrar BusyIndicator
            BusyIndicator.show(0);

        
            //const sFilter = "Creationdatetime ge datetime'2025-01-30T00:00:00'";
            const today = new Date().toISOString().split("T")[0] + "T00:00:00";
            const sFilter = `Creationdatetime ge datetime'${today}'`;
            const sExpand = "navHesToHesItems";
        
            oModel.read("/ServiceEntrySheetSet", {
                urlParameters: {
                    "$filter": sFilter,
                 //   "$expand": sExpand
                },
                success: function (oData) {
                    console.log("Datos obtenidos correctamente:", oData);
                    
                    // Guardar los datos en el modelo de vista
                    oViewModel.setProperty("/HESDocuments", oData.results);
                    oModelCore.setProperty("/HESDocuments", oData.results);
                    //sap.ui.getCore().setModel(oData.results, "viewModel");

                    // Ocultar BusyIndicator
                    BusyIndicator.hide();
                },
                error: function (oError) {
                    console.error("Error al obtener los datos:", oError);

                    // Ocultar BusyIndicator en caso de error
                    BusyIndicator.hide();
                }
            });
        }
        ,
        onNavigateToDetail: function (oEvent) {
            // const oRouter = UIComponent.getRouterFor(this);
            // const sServiceentrysheet = oEvent.getSource().getBindingContext().getProperty("Serviceentrysheet");
             // Obtener el router
             const oRouter = UIComponent.getRouterFor(this);

             // Obtener el número HES desde la fila seleccionada
             const sServiceentrysheet = oEvent.getSource().getBindingContext("viewModel").getProperty("Serviceentrysheet");
 
             oRouter.navTo("Detail", {
                 Serviceentrysheet: sServiceentrysheet
             });
          
        },
        onFilterSearch2: function () { 
            try {
                const oFilterModel = this.getView().getModel("filters");
                const oFiltersData = oFilterModel.getData();
                const oModel = this.getView().getModel();
                const oViewModel = this.getView().getModel("viewModel");
        
                if (!oModel) {
                    console.error("El modelo OData no está disponible.");
                    return;
                }
        
                let aFilters = [];
        
                if (oFiltersData.Serviceentrysheet) {
                    aFilters.push(`Serviceentrysheet eq '${oFiltersData.Serviceentrysheet}'`);
                }
                if (oFiltersData.PurchaseOrder) {
                    aFilters.push(`PurchaseOrder eq '${oFiltersData.PurchaseOrder}'`);
                }
                if (oFiltersData.Status) {
                    aFilters.push(`Status eq '${oFiltersData.Status}'`);
                }
                if (oFiltersData.ExternalNumber) {
                    aFilters.push(`ExternalNumber eq '${oFiltersData.ExternalNumber}'`);
                }
        
                //Solo aplicar filtro de fecha SI NO hay Serviceentrysheet o PurchaseOrder
                if (!oFiltersData.Serviceentrysheet && !oFiltersData.PurchaseOrder && oFiltersData.CreationDate) {
                    const sFilterDate = this._buildDateFilter(oFiltersData.CreationDate);
                    if (sFilterDate) {
                        aFilters.push(sFilterDate);
                    } else {
                        return;
                    }
                }
        
                // Si hay filtros, realizar la llamada al servicio OData
                if (aFilters.length > 0) {
                    this._fetchFilteredData(aFilters);
                } else {
                    // Si no hay filtros, limpiar la tabla
                    this._clearTableFilters();
                }
        
            } catch (error) {
                console.error("Error en la búsqueda:", error);
                sap.m.MessageToast.show("Error al ejecutar la búsqueda.");
            }
        },

        onFilterSearch21: function () { 
            try {
                const oFilterModel = this.getView().getModel("filters");
                const oFiltersData = oFilterModel.getData();
                const oModel = this.getView().getModel();
                const oViewModel = this.getView().getModel("viewModel");
        
                if (!oModel) {
                    console.error("El modelo OData no está disponible.");
                    return;
                }
        
                let aFilters = [];
        
                if (oFiltersData.Serviceentrysheet) {
                    aFilters.push(`Serviceentrysheet eq '${oFiltersData.Serviceentrysheet}'`);
                }
                if (oFiltersData.Purchaseorder) {
                    aFilters.push(`Purchaseorder eq '${oFiltersData.Purchaseorder}'`);
                }
                if (oFiltersData.Approvalstatus) {
                    aFilters.push(`Approvalstatus eq '${oFiltersData.Approvalstatus}'`);
                }
                
                if (oFiltersData.Serviceentrysheetname) {
                    aFilters.push(`Serviceentrysheetname eq '${oFiltersData.Serviceentrysheetname}'`);
                }
                if (oFiltersData.SupplierName) {
                    aFilters.push(`SupplierName eq '${oFiltersData.SupplierName}'`);
                }
                if (oFiltersData.Location) {
                    aFilters.push(`Location eq '${oFiltersData.Location}'`);
                }
                if (oFiltersData.ExtNumber) {
                    aFilters.push(`ExtNumber eq '${oFiltersData.ExtNumber}'`);
                }
        
             
        
                // Solo aplicar filtro de fecha SI NO hay Serviceentrysheet o Purchaseorder
                if (!oFiltersData.Serviceentrysheet && !oFiltersData.Purchaseorder && oFiltersData.Creationdatetime) {
                    const sFilterDate = this._buildDateFilter(oFiltersData.Creationdatetime);
                    if (sFilterDate) {
                        aFilters.push(sFilterDate);
                    } else {
                        return;
                    }
                }

                   // Si todos los campos están vacíos, cargar todos los documentos HES
                   const bAllFiltersEmpty = aFilters.length === 0;
                   if (bAllFiltersEmpty) {
                       this._loadHESDocuments();
                       return;
                   }
        
                // Llamar a _fetchFilteredData con los filtros aplicados
                this._fetchFilteredData(aFilters);
        
            } catch (error) {
                console.error("Error en la búsqueda:", error);
                sap.m.MessageToast.show("Error al ejecutar la búsqueda.");
            }
        },
        onFilterSearch: function () {  
            try {
                const oFilterModel = this.getView().getModel("filters");
                const oFiltersData = oFilterModel.getData();
                const oModel = this.getView().getModel();
                const oViewModel = this.getView().getModel("viewModel");
        
                if (!oModel) {
                    console.error("El modelo OData no está disponible.");
                    return;
                }
        
                let aFilters = [];
        
                // 📌 Filtros estándar
                if (oFiltersData.Serviceentrysheet) {
                    aFilters.push(`Serviceentrysheet eq '${oFiltersData.Serviceentrysheet}'`);
                }
                if (oFiltersData.Purchaseorder) {
                    aFilters.push(`Purchaseorder eq '${oFiltersData.Purchaseorder}'`);
                }
                if (oFiltersData.Serviceentrysheetname) {
                    aFilters.push(`Serviceentrysheetname eq '${oFiltersData.Serviceentrysheetname}'`);
                }
                if (oFiltersData.SupplierName) {
                    aFilters.push(`SupplierName eq '${oFiltersData.SupplierName}'`);
                }
                if (oFiltersData.Location) {
                    aFilters.push(`Location eq '${oFiltersData.Location}'`);
                }
                if (oFiltersData.ExtNumber) {
                    aFilters.push(`ExtNumber eq '${oFiltersData.ExtNumber}'`);
                }
        
               // 📌 Lógica para `Approvalstatus` y `IsDeleted`
                if (oFiltersData.Approvalstatus === "Approved") {
                    aFilters.push(`Approvalstatus eq 'X'`);
                } else if (oFiltersData.Approvalstatus === "Rejected") {
                   
                    // aFilters.push(`(Approvalstatus eq '' and IsDeleted eq true)`);
                    aFilters.push(`(Approvalstatus eq '' and Isdeleted eq true)`);
                } else if (oFiltersData.Approvalstatus === "Todos" || !oFiltersData.Approvalstatus) {  
                    // Si el usuario elige "Todos" o deja vacío, no aplicar filtro en Approvalstatus ni IsDeleted
                }

        
                // 📌 Aplicar rango de 60 días si `Creationdatetime` está vacío
                if (!oFiltersData.Serviceentrysheet && !oFiltersData.Purchaseorder && !oFiltersData.Creationdatetime) {
                    const today = new Date();
                    const pastDate = new Date();
                    pastDate.setDate(today.getDate() - 60); // Últimos 60 días
        
                    const sFormattedStartDate = pastDate.toISOString().split("T")[0] + "T00:00:00";
                    const sFormattedEndDate = today.toISOString().split("T")[0] + "T23:59:59";
        
                    aFilters.push(`Creationdatetime ge datetime'${sFormattedStartDate}' and Creationdatetime le datetime'${sFormattedEndDate}'`);
                } else if (oFiltersData.Creationdatetime) {
                    // Si hay un valor en Creationdatetime, aplicar el filtro de 30 días
                    const sFilterDate = this._buildDateFilter(oFiltersData.Creationdatetime);
                    if (sFilterDate) {
                        aFilters.push(sFilterDate);
                    } else {
                        return;
                    }
                }
        
                // 📌 Si no hay filtros aplicados, cargar todos los documentos HES
                if (aFilters.length === 0) {
                    this._loadHESDocuments();
                    return;
                }
        
                // 📌 Llamar a _fetchFilteredData con los filtros aplicados
                this._fetchFilteredData(aFilters);
        
            } catch (error) {
                console.error("Error en la búsqueda:", error);
                sap.m.MessageToast.show("Error al ejecutar la búsqueda.");
            }
        },
        

        
        /**
         * Construye el filtro de rango de fechas Creationdatetime en OData
         */
        _buildDateFilter2: function (sCreationDate) {
            const sCreationDateObj = new Date(sCreationDate);
            const sMinDateObj = new Date(sCreationDateObj);
            sMinDateObj.setDate(sCreationDateObj.getDate() - 30);
        
            // Validar que la diferencia no sea mayor a 30 días
            const iDaysDiff = Math.floor((sCreationDateObj - sMinDateObj) / (1000 * 60 * 60 * 24));
            if (iDaysDiff > 30) {
                sap.m.MessageToast.show("El rango de fechas no puede ser mayor a 30 días.");
                return null;
            }
        
            // Convertir a formato OData
            const sFormattedStartDate = sMinDateObj.toISOString().split("T")[0] + "T00:00:00";
            const sFormattedEndDate = sCreationDateObj.toISOString().split("T")[0] + "T23:59:59";
        
            return `Creationdatetime ge datetime'${sFormattedStartDate}' and Creationdatetime le datetime'${sFormattedEndDate}'`;
        },
        _buildDateFilter: function (sCreationDate) {
            const sCreationDateObj = new Date(sCreationDate);
            const sMinDateObj = new Date(sCreationDateObj);
            sMinDateObj.setDate(sCreationDateObj.getDate() - 30);
        
            // Validar que la diferencia no sea mayor a 30 días
            const iDaysDiff = Math.floor((sCreationDateObj - sMinDateObj) / (1000 * 60 * 60 * 24));
            if (iDaysDiff > 30) {
                sap.m.MessageToast.show("El rango de fechas no puede ser mayor a 30 días.");
                return null;
            }
        
            // Convertir a formato OData
            const sFormattedStartDate = sMinDateObj.toISOString().split("T")[0] + "T00:00:00";
            const sFormattedEndDate = sCreationDateObj.toISOString().split("T")[0] + "T23:59:59";
        
            return `Creationdatetime ge datetime'${sFormattedStartDate}' and Creationdatetime le datetime'${sFormattedEndDate}'`;
        },
        
        
        /**
         * Realiza la llamada OData con los filtros aplicados
         */
        _fetchFilteredData2: function (aFilters) {
            const oModel = this.getView().getModel();
            const oViewModel = this.getView().getModel("viewModel");
        
            // BUSY INDICATOR mientras se carga la data
            sap.ui.core.BusyIndicator.show(0);
        
            const sFilterQuery = aFilters.join(" and ");
        
            oModel.read("/ServiceEntrySheetSet", {
                urlParameters: { "$filter": sFilterQuery },
                success: function (oData) {
                    console.log("Datos obtenidos correctamente:", oData);
                    oViewModel.setProperty("/HESDocuments", oData.results);
                    sap.ui.core.BusyIndicator.hide();
                },
                error: function (oError) {
                    console.error("Error al obtener los datos:", oError);
                    sap.ui.core.BusyIndicator.hide();
                }
            });
        },

        _fetchFilteredData: function (aFilters) {
            const oModel = this.getView().getModel();
             const oViewModel = this.getView().getModel("viewModel");
         
             // BUSY INDICATOR mientras se carga la data
             sap.ui.core.BusyIndicator.show(0);
         
             const sFilterQuery = aFilters.join(" and ");
         
             oModel.read("/ServiceEntrySheetSet", {
                 urlParameters: { "$filter": sFilterQuery },
                 success: function (oData) {
                     console.log("Datos obtenidos correctamente:", oData);
                     oViewModel.setProperty("/HESDocuments", oData.results);
                     sap.ui.core.BusyIndicator.hide();
                 },
                 error: function (oError) {
                     console.error("Error al obtener los datos:", oError);
                     sap.ui.core.BusyIndicator.hide();
                 }
             });
         },
        


        
        
        /**
         * Limpia los filtros aplicados en la tabla
         */
        _clearTableFilters: function () {
            const oTable = this.byId("idHesTable");
            const oBinding = oTable.getBinding("items");
            oBinding.filter([]);
        },
        
        onDateChange: function (oEvent) {
            const oDatePicker = oEvent.getSource();
            const sSelectedDate = oDatePicker.getDateValue(); // Fecha seleccionada
            const today = new Date();
            const minDate = new Date(today);
            minDate.setDate(today.getDate() - 30); // Últimos 30 días
        
            if (sSelectedDate < minDate || sSelectedDate > today) {
                sap.m.MessageToast.show("Seleccione una fecha dentro de los últimos 30 días.");
                // Restaurar la fecha anterior seleccionada por el usuario en lugar de poner la de hoy
                oDatePicker.setDateValue(null); // O deja en blanco para que el usuario elija nuevamente
            }
        },
        
        
   
    });
});