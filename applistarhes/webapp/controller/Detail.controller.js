sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
    "../utils/formatter",
    "sap/m/MessageBox"
], function (Controller, MessageToast, UIComponent, formatter, MessageBox) {
    "use strict";

    return Controller.extend("com.example.controller.Detail", {
        formatter: formatter,
        onInit: function () {


            // Obtener el router para manejar eventos de enrutamiento
            const oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("Detail").attachPatternMatched(this._onPatternMatched, this);

        },
        _onPatternMatched21: function (oEvent) {
            try {
                // Obtener el parámetro Serviceentrysheet desde la ruta
                const sServiceentrysheet = oEvent.getParameter("arguments").Serviceentrysheet;
                
                // Obtener el modelo OData
                const oModel = this.getView().getModel();
                
                if (!oModel) {
                    console.error("El modelo OData no está disponible.");
                    MessageToast.show("Error: No se encontró el modelo de datos.");
                    return;
                }
        
                // Mostrar indicador de carga
                sap.ui.core.BusyIndicator.show(0);
        
                // Construir los filtros y expand para obtener los datos relacionados
                const sFilterHES = `Serviceentrysheet eq '${sServiceentrysheet}'`;
                const sExpandHES = "navHesToHesItems";
        
                // Realizar la solicitud OData para obtener los detalles de la HES
                oModel.read("/ServiceEntrySheetSet", {
                    urlParameters: {
                        "$filter": sFilterHES,
                        "$expand": sExpandHES
                    },
                    success: function (oData) {
                        if (!oData || !oData.results || oData.results.length === 0) {
                            console.warn(`No se encontró el documento con Serviceentrysheet: ${sServiceentrysheet}`);
                            MessageToast.show("El documento seleccionado no existe.");
                            sap.ui.core.BusyIndicator.hide();
                            return;
                        }
        
                        let oSelectedDocument = oData.results[0]; // Tomamos el primer resultado
                        oSelectedDocument.Services = oSelectedDocument.navHesToHesItems?.results || [];
        
                        // Obtener archivos HES
                        const sFilterFiles = `entrySheet eq '${sServiceentrysheet}'`;
                        oModel.read("/downloadFileSet", {
                            urlParameters: {
                                "$filter": sFilterFiles
                            },
                            success: function (oFileData) {
                                if (oFileData) {
                                    oSelectedDocument.Files = oFileData.results; // Guardamos los archivos en el documento
                                } else {
                                    oSelectedDocument.Files = []; // Si no hay archivos, asignamos un array vacío
                                }
        
                                // Crear y asignar modelo de vista con los datos obtenidos
                                const oViewModel = new sap.ui.model.json.JSONModel({ SelectedHES: oSelectedDocument });
                                this.getView().setModel(oViewModel, "viewModel");
        
                                console.log("Datos cargados correctamente en la vista:", oSelectedDocument);
        
                                // Ocultar indicador de carga
                                sap.ui.core.BusyIndicator.hide();
                            }.bind(this),
                            error: function (oError) {
                                console.error("Error al obtener archivos HES:", oError);
                                oSelectedDocument.Files = []; // Si hay error, asignamos un array vacío
                                
                                // Crear modelo de vista sin archivos
                                const oViewModel = new sap.ui.model.json.JSONModel({ SelectedHES: oSelectedDocument });
                                this.getView().setModel(oViewModel, "viewModel");
        
                                sap.ui.core.BusyIndicator.hide();
                            }.bind(this)
                        });
        
                    }.bind(this),
                    error: function (oError) {
                        console.error("Error al obtener los datos de la HES:", oError);
                        MessageToast.show("Error al cargar los datos.");
                        sap.ui.core.BusyIndicator.hide();
                    }
                });
        
            } catch (error) {
                console.error("Error en _onPatternMatched:", error);
                MessageToast.show("Ha ocurrido un error al procesar los datos.");
                sap.ui.core.BusyIndicator.hide();
            }
        },
        
        _onPatternMatched2: function (oEvent) {
            try {
                // Obtener el parámetro Serviceentrysheet desde la ruta
                const sServiceentrysheet = oEvent.getParameter("arguments").Serviceentrysheet;
                
                // Obtener el modelo OData
                const oModel = this.getView().getModel();
                
                if (!oModel) {
                    console.error("El modelo OData no está disponible.");
                    MessageToast.show("Error: No se encontró el modelo de datos.");
                    return;
                }
        
                // Mostrar indicador de carga
                sap.ui.core.BusyIndicator.show(0);
        
                // Construir el filtro y expand para obtener los datos relacionados
                const sFilter = `Serviceentrysheet eq '${sServiceentrysheet}'`;
                const sExpand = "navHesToHesItems";
        
                // Realizar la solicitud OData para obtener los detalles
                oModel.read("/ServiceEntrySheetSet", {
                    urlParameters: {
                        "$filter": sFilter,
                        "$expand": sExpand
                    },
                    success: function (oData) {
                        if (!oData || !oData.results || oData.results.length === 0) {
                            console.warn(`No se encontró el documento con Serviceentrysheet: ${sServiceentrysheet}`);
                            MessageToast.show("El documento seleccionado no existe.");
                            sap.ui.core.BusyIndicator.hide();
                            return;
                        }
        
                        let oSelectedDocument = oData.results[0]; // Tomamos el primer resultado
        
                        // Extraer los servicios relacionados si existen
                        oSelectedDocument.Services = oSelectedDocument.navHesToHesItems?.results || [];
        
                        // Crear y asignar modelo de vista con los datos obtenidos
                        const oViewModel = new sap.ui.model.json.JSONModel({ SelectedHES: oSelectedDocument });
                        this.getView().setModel(oViewModel, "viewModel");
        
                        console.log("Datos cargados correctamente en la vista:", oSelectedDocument);
        
                        // Ocultar indicador de carga
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                    error: function (oError) {
                        console.error("Error al obtener los datos:", oError);
                        MessageToast.show("Error al cargar los datos.");
                        sap.ui.core.BusyIndicator.hide();
                    }
                });
        
            } catch (error) {
                console.error("Error en _onPatternMatched:", error);
                MessageToast.show("Ha ocurrido un error al procesar los datos.");
                sap.ui.core.BusyIndicator.hide();
            }
        },
        _onPatternMatched: function (oEvent) {
            try {
                // Obtener el parámetro Serviceentrysheet desde la ruta
                const sServiceentrysheet = oEvent.getParameter("arguments").Serviceentrysheet;
                
                // Obtener el modelo OData
                const oModel = this.getView().getModel();
                
                if (!oModel) {
                    console.error("El modelo OData no está disponible.");
                    MessageToast.show("Error: No se encontró el modelo de datos.");
                    return;
                }
        
                // Mostrar indicador de carga
                sap.ui.core.BusyIndicator.show(0);
        
                // Construir los filtros y expand para obtener los datos relacionados
                const sFilterHES = `Serviceentrysheet eq '${sServiceentrysheet}'`;
                const sExpandHES = "navHesToHesItems";
        
                // Realizar la solicitud OData para obtener los detalles de la HES
                oModel.read("/ServiceEntrySheetSet", {
                    urlParameters: {
                        "$filter": sFilterHES,
                        "$expand": sExpandHES
                    },
                    success: function (oData) {
                        if (!oData || !oData.results || oData.results.length === 0) {
                            console.warn(`No se encontró el documento con Serviceentrysheet: ${sServiceentrysheet}`);
                            MessageToast.show("El documento seleccionado no existe.");
                            sap.ui.core.BusyIndicator.hide();
                            return;
                        }
        
                        let oSelectedDocument = oData.results[0]; // Tomamos el primer resultado
                        oSelectedDocument.Services = oSelectedDocument.navHesToHesItems?.results || [];
        
                        // Obtener archivos HES
                        const sFilterFiles = `entrySheet eq '${sServiceentrysheet}'`;
                        oModel.read("/downloadFileSet", {
                            urlParameters: { "$filter": sFilterFiles },
                            success: function (oFileData) {
                                oSelectedDocument.Files = oFileData.results || [];
                                
                                // 🔹 Nueva llamada para obtener los textos de la HES
                                const sFilterTexts = `SheetNo eq '${sServiceentrysheet}'`;
                                oModel.read("/serviceEntrySheetTextsSet", {
                                    urlParameters: { "$filter": sFilterTexts },
                                    success: function (oTextData) {
                                        oSelectedDocument.Texts = oTextData.results || [];
                                        
                                        // Crear y asignar modelo de vista con todos los datos obtenidos
                                        const oViewModel = new sap.ui.model.json.JSONModel({ SelectedHES: oSelectedDocument });
                                        this.getView().setModel(oViewModel, "viewModel");
        
                                        console.log("Datos cargados correctamente en la vista:", oSelectedDocument);
                                        sap.ui.core.BusyIndicator.hide();
                                    }.bind(this),
                                    error: function (oError) {
                                        console.error("Error al obtener textos HES:", oError);
                                        oSelectedDocument.Texts = [];
        
                                        // Crear modelo de vista sin textos
                                        const oViewModel = new sap.ui.model.json.JSONModel({ SelectedHES: oSelectedDocument });
                                        this.getView().setModel(oViewModel, "viewModel");
        
                                        sap.ui.core.BusyIndicator.hide();
                                    }.bind(this)
                                });
                                
                            }.bind(this),
                            error: function (oError) {
                                console.error("Error al obtener archivos HES:", oError);
                                oSelectedDocument.Files = [];
        
                                // Crear modelo de vista sin archivos
                                const oViewModel = new sap.ui.model.json.JSONModel({ SelectedHES: oSelectedDocument });
                                this.getView().setModel(oViewModel, "viewModel");
        
                                sap.ui.core.BusyIndicator.hide();
                            }.bind(this)
                        });
        
                    }.bind(this),
                    error: function (oError) {
                        console.error("Error al obtener los datos de la HES:", oError);
                        MessageToast.show("Error al cargar los datos.");
                        sap.ui.core.BusyIndicator.hide();
                    }
                });
        
            } catch (error) {
                console.error("Error en _onPatternMatched:", error);
                MessageToast.show("Ha ocurrido un error al procesar los datos.");
                sap.ui.core.BusyIndicator.hide();
            }
        },
        

        onDownloadFile: function (oEvent) {
            var oItem = oEvent.getSource().getBindingContext("viewModel").getObject();
        
            // Verifica si el archivo tiene contenido
            if (!oItem.Content) {
                MessageToast.show("El archivo no tiene contenido disponible.");
                return;
            }
        
            // Convierte la cadena Base64 en un blob
            var byteCharacters = atob(oItem.Content);
            var byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            var blob = new Blob([byteArray], { type: oItem.Mimetype });
        
            // Crea un enlace de descarga
            var link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = oItem.Filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        
        
        onApproveHES: function () {
            let oModel = this.getView().getModel();
            let oViewModel = this.getView().getModel("viewModel");
        
            const oSelectedHES = oViewModel.getProperty("/SelectedHES");
        
            if (!oSelectedHES || !oSelectedHES.Serviceentrysheet) {
                MessageToast.show("No se ha seleccionado un HES válido.");
                return;
            }
        
            // Construir el filtro para la aprobación
           // const sPath = `/ReleaseSet?$filter=Serviceentrysheet eq '${oSelectedHES.Serviceentrysheet}' and Estado eq 'A'`;
            // Construir el filtro para la aprobación
              const sFilterHES = `Serviceentrysheet eq '${oSelectedHES.Serviceentrysheet}' and Estado eq 'A'`;

            // Mostrar indicador de carga
            sap.ui.core.BusyIndicator.show(0);
        
            oModel.read("/ReleaseSet", {
                urlParameters: {
                    "$filter": sFilterHES
                },
                success: function (data) {
                    // MessageToast.show(`El HES ${oSelectedHES.Serviceentrysheet} fue aprobado.`);
                    // oSelectedHES.Status = "Aprobado";
                    // oSelectedHES.Status = data.results[0].Estado;
                    if (data.results.length > 0 && data.results[0].Estado === 'A') {
                        MessageBox.success(
                            "Mensaje: " + data.results[0].Message + ".\nEstado: " + data.results[0].Estado, 
                            {
                                actions: [MessageBox.Action.OK],
                                onClose: function (sAction) {
                                    if (sAction === MessageBox.Action.OK) {
                                        this._navigateBack();
                                    }
                                }.bind(this)
                            }
                        );
                    } else {
                        MessageBox.error(
                            "Mensaje: " + data.results[0].Message + ".\nEstado: " + data.results[0].Estado,
                            {
                                actions: [MessageBox.Action.OK],
                                onClose: function (sAction) {
                                    if (sAction === MessageBox.Action.OK) {
                                        this._navigateBack();
                                    }
                                }.bind(this)
                            }
                        );
                    }

                 

                    oViewModel.refresh(true);
                    sap.ui.core.BusyIndicator.hide();
                   //     this._navigateBack();
                }.bind(this),
                error: function (oError) {
                    MessageToast.show("Error al aprobar el HES.");
                    console.error("Error en aprobación:", oError);
                    sap.ui.core.BusyIndicator.hide();
                }
            });
        },
        
        onRejectHES: function () {
            let oModel = this.getView().getModel();
            let oViewModel = this.getView().getModel("viewModel");
        
            const oSelectedHES = oViewModel.getProperty("/SelectedHES");
        
            if (!oSelectedHES || !oSelectedHES.Serviceentrysheet) {
                MessageToast.show("No se ha seleccionado un HES válido.");
                return;
            }
        
            // Construir el filtro para el rechazo
           // const sPath = `/ReleaseSet?$filter=Serviceentrysheet eq '${oSelectedHES.Serviceentrysheet}' and Estado eq 'R'`;
        
           const sFilterHES = `Serviceentrysheet eq '${oSelectedHES.Serviceentrysheet}' and Estado eq 'R'`;

           // Mostrar indicador de carga
           sap.ui.core.BusyIndicator.show(0);
       
           oModel.read("/ReleaseSet", {
               urlParameters: {
                   "$filter": sFilterHES
               },
                success: function (data) {
                    // MessageToast.show(`El HES ${oSelectedHES.Serviceentrysheet} fue aprobado.`);
                    // oSelectedHES.Status = "Rechazado";
                    // oSelectedHES.Status = data.results[0].Estado;
                    
                    if (data.results.length > 0 && data.results[0].Estado === 'R') {
                        MessageBox.success(
                            "Mensaje: " + data.results[0].Message + ".\nEstado: " + data.results[0].Estado, 
                            {
                                actions: [MessageBox.Action.OK],
                                onClose: function (sAction) {
                                    if (sAction === MessageBox.Action.OK) {
                                        this._navigateBack();
                                    }
                                }.bind(this)
                            }
                        );
                    } else {
                        MessageBox.error(
                            "Mensaje: " + data.results[0].Message + ".\nEstado: " + data.results[0].Estado,
                            {
                                actions: [MessageBox.Action.OK],
                                onClose: function (sAction) {
                                    if (sAction === MessageBox.Action.OK) {
                                        this._navigateBack();
                                    }
                                }.bind(this)
                            }
                        );
                    }

                    oViewModel.refresh(true);
                    sap.ui.core.BusyIndicator.hide();
                 //   this._navigateBack();
                }.bind(this),
                error: function (oError) {
                    MessageToast.show("Error al rechazar el HES.");
                    console.error("Error en rechazo:", oError);
                    sap.ui.core.BusyIndicator.hide();
                }
            });
        },
        
        _navigateBack: function () {
            let oModel = this.getView().getModel("viewModel");
            oModel.refresh(true); 
        
            const oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("RouteView1");
        }

        
    });
});
