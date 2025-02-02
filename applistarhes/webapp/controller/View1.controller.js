sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/BusyIndicator"
], function (Controller, UIComponent, MessageToast, JSONModel, Filter, FilterOperator, BusyIndicator) {
    "use strict";

    return Controller.extend("app.hes.applistarhes.controller.View1", {
        onInit: function () {
            this.getOwnerComponent().getModel().attachMetadataLoaded(null, function() {
                console.log("Modelo OData cargado correctamente.");
            }, this);
        
            // Intentar forzar la carga del modelo en la vista
            const oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel);
            
            // Crear un modelo JSON para los filtros
            const oFilterModel = new JSONModel({
                Serviceentrysheet: "",
                PurchaseOrder: "",
                Status: "",
                ExternalNumber: ""
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
                    "$expand": sExpand
                },
                success: function (oData) {
                    console.log("Datos obtenidos correctamente:", oData);
                    
                    // Guardar los datos en el modelo de vista
                    oViewModel.setProperty("/HESDocuments", oData.results);

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

        onFilterSearch: function (oEvent) {
            const oFilterModel = this.getView().getModel("filters");
            const oFiltersData = oFilterModel.getData();

            const aFilters = [];

            if (oFiltersData.Serviceentrysheet) {
                aFilters.push(new Filter("Serviceentrysheet", FilterOperator.Contains, oFiltersData.Serviceentrysheet));
            }
            if (oFiltersData.PurchaseOrder) {
                aFilters.push(new Filter("PurchaseOrder", FilterOperator.Contains, oFiltersData.PurchaseOrder));
            }
            if (oFiltersData.Status) {
                aFilters.push(new Filter("Status", FilterOperator.EQ, oFiltersData.Status));
            }
            if (oFiltersData.ExternalNumber) {
                aFilters.push(new Filter("ExternalNumber", FilterOperator.Contains, oFiltersData.ExternalNumber));
            }

            const oTable = this.byId("idHesTable");
            const oBinding = oTable.getBinding("items");

            if (aFilters.length > 0) {
                oBinding.filter(new Filter({ filters: aFilters, and: true }));
            } else {
                oBinding.filter([]);
            }
        },

        onApproveHES: function () {
            MessageToast.show("HES aprobado con éxito.");
        },

        onRejectHES: function () {
            MessageToast.show("HES rechazado con éxito.");
        }
    });
});