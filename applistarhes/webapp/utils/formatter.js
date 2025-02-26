sap.ui.define([
    "sap/ui/core/format/DateFormat",
    "sap/base/Log" // Para manejar errores de manera más eficiente
], function (DateFormat, Log) {
    "use strict";

    return {
        /**
         * Formatea una fecha en el formato deseado.
         * @param {string} sDate - La fecha en formato ISO (YYYY-MM-DD) o cualquier formato válido para `new Date()`.
         * @returns {string} - La fecha formateada o una cadena vacía si la fecha no es válida.
         */
        formatDate: function (sDate) {
            try {
                // Validar si la fecha es nula, indefinida o una cadena vacía
                if (!sDate) {
                    return "";
                }

                // Crear un objeto Date
                var oDate = new Date(sDate);

                // Validar si la fecha es inválida (por ejemplo, "Invalid Date")
                if (isNaN(oDate.getTime())) {
                    Log.warning("Fecha no válida proporcionada: " + sDate);
                    return "";
                }

                // Obtener una instancia de DateFormat con el patrón deseado
                var oDateFormat = DateFormat.getDateInstance({
                    pattern: "dd/MM/yyyy" // Define el patrón de formato
                });

                // Formatear la fecha
                return oDateFormat.format(oDate);
            } catch (oError) {
                // Manejar cualquier error inesperado
                Log.error("Error al formatear la fecha: " + oError.message);
                return "";
            }
        },
        checkEmptyField: function (sValue) {
            try {
                // Validar si el campo está vacío, es nulo o indefinido
                if (!sValue || sValue.trim() === "") {
                    return "Aprobado"; // Retornar "Aprobado" si el campo está vacío
                }

                // Retornar el valor original si no está vacío
                return sValue;
            } catch (oError) {
                // Manejar cualquier error inesperado
                Log.error("Error al validar el campo: " + oError.message);
                return ""; // Retornar una cadena vacía en caso de error
            }
        },
        formatNumber: function(sValue) {
            if (!sValue) return "";
    
            // Convertir a número
            let fNumber = parseFloat(sValue);
            if (isNaN(fNumber)) return sValue; // Si no es un número, devolver sin cambios
    
            // Formatear con separador de miles "." y sin decimales
            return fNumber.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        },
        formatEmptyToUN: function(sValue) {
            return sValue && sValue.trim() !== "" ? sValue : "UN";
        },
        formatStatusText: function (sValue) {
            if (sValue === "X") {
                return "Aprobado";
            } else {
                return "";
            }
        },
        getStatusText: function (sApprovalStatus, bIsDeleted) {
            // Validar si el estado es "Aprobado"
            if (sApprovalStatus === "X") {
                return "Aprobado";
            }

            // Validar si el estado es "Rechazado"
            if (sApprovalStatus === "" && bIsDeleted) {
                return "Rechazado";
            }

            // Caso por defecto
            return "";
        },
        getStatus: function (sApprovalStatus, bIsDeleted) {
            // Validar si el estado es "Aprobado"
            if (sApprovalStatus === "X") {
                return false;
            }

            // Validar si el estado es "Rechazado"
            if (sApprovalStatus === "" && bIsDeleted) {
                return false;
            }

            // Caso por defecto
            return true;
        },
        getStatusColor: function (sApprovalStatus, bIsDeleted) {
            if (sApprovalStatus === "X") {
                return "Success"; // Verde
            }

            if (sApprovalStatus === "" && bIsDeleted) {
                return "Error"; // Rojo
            }

            return "None"; // Sin color
        },
        formatTextLines: function (aTextLines) {
            if (!aTextLines || aTextLines.length === 0) {
                return "";
            }
            return aTextLines.map(item => item.TextLine).join("\n");
        }
    };
});