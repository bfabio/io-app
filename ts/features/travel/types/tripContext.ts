import * as t from "io-ts";

const DestinationBrief = t.type({
  schema: t.literal("destination-brief/v1"),
  trip_id: t.string,
  countries: t.array(t.string),
  baseline_hash: t.string,
  sections: t.UnknownRecord,
  coverage: t.record(
    t.string,
    t.union([t.literal("fresh"), t.literal("stale"), t.literal("missing")])
  ),
  suppressed_fact_ids: t.array(t.string),
  generated_at: t.string,
  resolver_version: t.literal("destination-brief-resolver/v1"),
  input_projection_hashes: t.array(t.string),
  projection_hash: t.string
});

const TravelTrip = t.type({
  trip_id: t.string,
  trip_name: t.string,
  trip_start: t.string,
  trip_end: t.string,
  route: t.array(t.string),
  countries: t.array(t.string),
  places: t.array(t.UnknownRecord),
  legs: t.array(t.UnknownRecord),
  stays: t.array(t.UnknownRecord),
  reservations: t.array(t.UnknownRecord),
  artifacts: t.array(t.UnknownRecord),
  gaps: t.array(t.UnknownRecord)
});

export const TravelTripContext = t.type({
  schema: t.literal("travel-trip-context/v1"),
  trip_id: t.string,
  trip: TravelTrip,
  route_graph: t.UnknownRecord,
  destination_brief: t.union([DestinationBrief, t.null]),
  generated_at: t.string,
  projection_hash: t.string
});

export type TravelTripContext = t.TypeOf<typeof TravelTripContext>;

export const TravelTripContextIndex = t.type({
  schema: t.literal("travel-trip-context-index/v1"),
  generated_at: t.string,
  contexts: t.array(TravelTripContext),
  projection_hash: t.string
});

export type TravelTripContextIndex = t.TypeOf<typeof TravelTripContextIndex>;

/**
 * Validates the read-only travel payload before it reaches app state. A schema
 * mismatch is treated as an incompatible server response, never as an empty
 * trip: otherwise a client regression could hide a real routing gap.
 */
export const decodeTravelTripContext = (value: unknown): TravelTripContext => {
  const decoded = TravelTripContext.decode(value);
  if ("left" in decoded) {
    throw new Error("Incompatible travel trip context");
  }
  return decoded.right;
};
