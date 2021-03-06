import { getType } from "typesafe-actions";
import { createSelector } from "reselect";
import { InternalRoute } from "../../components/ui/Markdown/handlers/internalLink";
import { Action } from "../actions/types";
import {
  addInternalRouteNavigation,
  resetInternalRouteNavigation
} from "../actions/internalRouteNavigation";
import { GlobalState } from "./types";

export type InternalRouteNavigationState = InternalRoute | null;

const initialInternalRouteNavigationState = null;

const reducer = (
  state: InternalRouteNavigationState = initialInternalRouteNavigationState,
  action: Action
): InternalRouteNavigationState => {
  switch (action.type) {
    case getType(addInternalRouteNavigation):
      return action.payload;
    case getType(resetInternalRouteNavigation):
      return initialInternalRouteNavigationState;
    default:
      return state;
  }
};

export const internalRouteNavigationSelector = (
  state: GlobalState
): InternalRouteNavigationState => state.internalRouteNavigation;

export const internalRouteNavigationParamsSelector = createSelector(
  internalRouteNavigationSelector,
  irn => irn && irn.params
);

export default reducer;
