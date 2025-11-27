import * as React from "react";
import { CommonActions } from "@react-navigation/native";

export const navigationRef = React.createRef();

export function safeNavigate(name, params) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  } else {
    console.log("⚠ Navegación ignorada (navigator no listo todavía)");
  }
}

import { tokenStorage } from "../services/tokenStorage";
import { getReservaUsuarioClase } from "../services/reservasService";

export async function navigateToClaseDetail(claseId, reservaFromNotification = null) {

  if (reservaFromNotification) {
    safeNavigate("DetalleReserva", {
      reserva: reservaFromNotification,
      claseId,
    });
    return;
  }

  try {
    const user = await tokenStorage.getUser();
    const reserva = await getReservaUsuarioClase(user.id, claseId);

    if (reserva) {
      safeNavigate("DetalleReserva", { reserva, claseId });
      return;
    }

    safeNavigate("ClaseDetail", { claseId, reservaId: null });

  } catch (e) {
    safeNavigate("ClaseDetail", { claseId, reservaId: null });
  }
}
