import {INIT_END as INIT_END_sites, SITE_ADD, SET_CURRENT_SITE as SET_CURRENT_SITE_sites, setCurrentSite} from '../ducks/sites';
import {INIT_END as INIT_END_models, MODEL_ADD, SET_CURRENT_MODEL, updateCurrentModels} from '../ducks/models';
import {openModel} from '../ducks/nav';


export const structure = store => next => action => {
  next(action);
  
  if (action.type == INIT_END_sites) {
    let currentSite = action.sitesUser.length ? action.sitesUser[0] : null;
    next(setCurrentSite(currentSite));
  }
  
  if (action.type == SITE_ADD)
    next(setCurrentSite(action.site));
  
  if (action.type == INIT_END_models ||
      action.type == SET_CURRENT_SITE_sites)
    next(updateCurrentModels());
  
  if (action.type == SET_CURRENT_MODEL)
    next(openModel());
};
