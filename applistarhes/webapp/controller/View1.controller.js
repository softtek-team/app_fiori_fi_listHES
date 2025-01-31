sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, UIComponent, MessageToast, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("app.hes.applistarhes.controller.View1", {
        onInit: function () {
            // Obtener el modelo OData declarado en el manifest.json
            const oModel = this.getView().getModel();
            
            // Crear un modelo JSON para los filtros
            const oFilterModel = new JSONModel({
                Serviceentrysheet: "",
                PurchaseOrder: "",
                Status: "",
                ExternalNumber: ""
            });
            this.getView().setModel(oFilterModel, "filters");

            // Cargar los datos iniciales
            this._loadHESDocuments();
        },

        _loadHESDocuments: function () {
            const oTable = this.byId("idHesTable");
            const oBinding = oTable.getBinding("items");

            if (oBinding) {
                oBinding.refresh();
            }
        },

        onNavigateToDetail: function (oEvent) {
            const oRouter = UIComponent.getRouterFor(this);
            const sServiceentrysheet = oEvent.getSource().getBindingContext().getProperty("Serviceentrysheet");

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