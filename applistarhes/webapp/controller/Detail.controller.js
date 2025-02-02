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
            try {
                // Obtener el parámetro Serviceentrysheet desde la ruta
                const sServiceentrysheet = oEvent.getParameter("arguments").Serviceentrysheet;
                
                // Obtener el modelo de datos global
                const oModelCore = sap.ui.getCore().getModel("viewModel");
                
                if (!oModelCore) {
                    console.error("El modelo 'viewModel' no está definido.");
                    MessageToast.show("Error: No se encontró el modelo de datos.");
                    return;
                }
        
                // Obtener los datos del modelo
                const oData = oModelCore.getProperty("/");
                if (!oData) {
                    console.error("No se encontraron datos en el modelo.");
                    MessageToast.show("No se encontraron datos para mostrar.");
                    return;
                }
        
                // Buscar el documento correspondiente al Serviceentrysheet
                const sKey = `ServiceEntrySheetSet('${sServiceentrysheet}')`;
                const oSelectedDocument = oData[sKey];
        
                if (!oSelectedDocument) {
                    console.warn(`No se encontró el documento con Serviceentrysheet: ${sServiceentrysheet}`);
                    MessageToast.show("El documento seleccionado no existe.");
                    return;
                }
        
                // Verificar si existen servicios relacionados en `navHesToHesItems`
                oSelectedDocument.Services = (oSelectedDocument.navHesToHesItems?.__list || [])
                    .map(sServiceKey => oData[sServiceKey])
                    .filter(service => service !== undefined); // Evita valores `undefined`
        
                // Crear y asignar modelo de vista
                const oViewModel = new sap.ui.model.json.JSONModel({ ...oData, SelectedHES: oSelectedDocument });
                this.getView().setModel(oViewModel, "viewModel");
        
                console.log("Datos cargados correctamente en la vista:", oSelectedDocument);
        
            } catch (error) {
                console.error("Error en _onPatternMatched:", error);
                MessageToast.show("Ha ocurrido un error al procesar los datos.");
            }
        },
        
        _onPatternMatched2: function (oEvent) {
            try {
                // Obtener el parámetro Serviceentrysheet desde la ruta
                const sServiceentrysheet = oEvent.getParameter("arguments").Serviceentrysheet;
        
                // Obtener el modelo de la vista (asegurarse de que existe)
                  let  oModelCore = sap.ui.getCore().getModel("viewModel");
                  
        
                if (!oModelCore) {
                    console.error("El modelo 'viewModel' no está definido.");
                    MessageToast.show("Error: No se encontró el modelo de datos.");
                    return;
                }
        
                this.getView().setModel(oModelCore, "viewModel");
        
                // Obtener los datos del modelo
                const oData = oModelCore.getProperty("/");
        
                if (!oData) {
                    console.error("No se encontraron datos en el modelo.");
                    MessageToast.show("No se encontraron datos para mostrar.");
                    return;
                }
        
                // Buscar el documento correspondiente al Serviceentrysheet
                const sKey = `ServiceEntrySheetSet('${sServiceentrysheet}')`;
                let oSelectedDocument = oData[sKey];
        
                if (!oSelectedDocument) {
                    console.warn(`No se encontró el documento con Serviceentrysheet: ${sServiceentrysheet}`);
                    MessageToast.show("El documento seleccionado no existe.");
                    return;
                }
        
                // Verificar si existen servicios relacionados en `navHesToHesItems`
                if (oSelectedDocument.navHesToHesItems && Array.isArray(oSelectedDocument.navHesToHesItems.__list)) {
                    let aServices = oSelectedDocument.navHesToHesItems.__list
                        .map(sServiceKey => oData[sServiceKey])
                        .filter(service => service !== undefined); // Evitar elementos `undefined`
        
                    oSelectedDocument.Services = aServices.length > 0 ? aServices : [];
                } else {
                    oSelectedDocument.Services = [];
                }
        
                // Establecer el documento seleccionado en el modelo de vista
                const oViewModel = new sap.ui.model.json.JSONModel(oData);
                this.getView().setModel(oViewModel, "viewModel");

                
                this.getView().getModel("viewModel").setProperty("/SelectedHES", oSelectedDocument);
        
                // REFRESCAR la vista para que se actualicen los datos
                oView.refresh(true);
        
                console.log("Datos cargados correctamente en la vista:", oSelectedDocument);
        
            } catch (error) {
                console.error("Error en _onPatternMatched:", error);
                MessageToast.show("Ha ocurrido un error al procesar los datos.");
            }
        },
        _onPatternMatched3: function (oEvent) {
            try {
                // Obtener el parámetro Serviceentrysheet desde la ruta
                const sServiceentrysheet = oEvent.getParameter("arguments").Serviceentrysheet;

                // Obtener el modelo OData de la vista
                const oModel = this.getView().getModel();

                if (!oModel) {
                    console.error("El modelo OData no está definido.");
                    MessageToast.show("Error: No se encontró el modelo de datos.");
                    return;
                }

                // Leer los detalles del ServiceEntrySheet desde el servicio OData
                oModel.read(`/ServiceEntrySheetSet('${sServiceentrysheet}')`, {
                    success: function (oData) {
                        // Crear un modelo JSON para la vista
                        const oViewModel = new sap.ui.model.json.JSONModel(oData);
                        this.getView().setModel(oViewModel, "viewModel");

                        // Cargar los servicios relacionados (navHesToHesItems)
                        this._loadRelatedServices(sServiceentrysheet);
                    }.bind(this),
                    error: function (oError) {
                        console.error("Error al cargar los detalles del HES:", oError);
                        MessageToast.show("Error al cargar los detalles del HES.");
                    }
                });

            } catch (error) {
                console.error("Error en _onPatternMatched:", error);
                MessageToast.show("Ha ocurrido un error al procesar los datos.");
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
