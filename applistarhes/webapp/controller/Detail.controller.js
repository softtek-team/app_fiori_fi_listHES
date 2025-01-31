sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
], function (Controller, MessageToast, UIComponent) {
    "use strict";

    return Controller.extend("com.example.controller.Detail", {
        onInit: function () {
            // Obtener el router para manejar eventos de enrutamiento
            const oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("Detail").attachPatternMatched(this._onPatternMatched, this);
        },

        _onPatternMatched: function (oEvent) {
            // Obtener el parámetro Serviceentrysheet desde la ruta
            const sServiceentrysheet = oEvent.getParameter("arguments").Serviceentrysheet;

            // Establecer el Serviceentrysheet en el modelo para mostrar en la vista
            // Establecer el Serviceentrysheet en el modelo para mostrar en la vista
            let  oModelCore = sap.ui.getCore().getModel("viewModel");
            this.getView().setModel(oModelCore, "viewModel");
            const aDocuments = oModelCore.getProperty("/HESDocuments");


            // Buscar el documento correspondiente al Serviceentrysheet
            const oSelectedDocument = aDocuments.find(doc => doc.Serviceentrysheet === sServiceentrysheet);

            if (oSelectedDocument) {
                oModelCore.setProperty("/SelectedHES", oSelectedDocument);
            } else {
                MessageToast.show("El documento seleccionado no existe.");
            }
        },

        onApproveHES: function () {
            //let  oModelCore = sap.ui.getCore().getModel("viewModel");
            let  oModel = this.getView().getModel("viewModel"); 
            
            const oSelectedHES = oModel.getProperty("/SelectedHES");

            if (oSelectedHES) {
                oSelectedHES.Status = "Aprobado";
                MessageToast.show(`El HES ${oSelectedHES.Serviceentrysheet} fue aprobado.`);
                this._navigateBack();
            }
        },

        onRejectHES: function () {
           // let  oModelCore = sap.ui.getCore().getModel("viewModel");
           let  oModel = this.getView().getModel("viewModel"); 
            const oSelectedHES = oModel.getProperty("/SelectedHES");

            if (oSelectedHES) {
                oSelectedHES.Status = "Rechazado";
                MessageToast.show(`El HES ${oSelectedHES.Serviceentrysheet} fue rechazado.`);
                this._navigateBack();
            }
        },

        _navigateBack: function () {
            // Refrescar el modelo "viewModel"
            let oModel = this.getView().getModel("viewModel");
            oModel.refresh(true); // 'true' asegura que las vinculaciones también se actualicen.
        
            // Navegar de vuelta a la lista de HES
            const oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("RouteView1");
        }
        
    });
});
