import {INIT_END, showAlert, URL_PAYMENT_METHODS, URL_USERSPACE} from "ducks/nav";
import {ALERT_TYPE_CONFIRM} from "components/modals/AlertModal/AlertModal";

export const payments = store => next => action => {
  next(action);

  if (action.type == INIT_END) {
    if (store.getState().nav.showUnpaidSub) {
      const {navigate} = store.getState().nav;
      next(showAlert({
        type: ALERT_TYPE_CONFIRM,
        title: `Failed payment`,
        description: `We can't withdraw money for next payment period. Please, update your payment methods.`,
        confirmLabel: 'Open payment methods',
        cancelLabel: 'Close',
        onConfirm: () => navigate(`/${URL_USERSPACE}/${URL_PAYMENT_METHODS}`)
      }));
    }
  }
}