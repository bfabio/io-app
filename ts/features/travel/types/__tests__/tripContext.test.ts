import {
  decodeTravelTripContext,
  TravelTripContextIndex
} from "../tripContext";

const context = {
  schema: "travel-trip-context/v1",
  trip_id: "trip-1",
  trip: {
    trip_id: "trip-1",
    trip_name: "Atene e Porto",
    trip_start: "2026-08-13",
    trip_end: "2026-08-20",
    route: ["Athens", "Porto"],
    countries: ["GR", "PT"],
    places: [],
    legs: [],
    stays: [],
    reservations: [],
    artifacts: [],
    gaps: []
  },
  route_graph: {},
  destination_brief: null,
  generated_at: "2026-08-16T19:00:00Z",
  projection_hash: `sha256:${"a".repeat(64)}`
};

describe("travel trip context contract", () => {
  it("accepts the read-only server payload", () => {
    expect(decodeTravelTripContext(context)).toEqual(context);
    expect(
      "right" in
        TravelTripContextIndex.decode({
          schema: "travel-trip-context-index/v1",
          generated_at: "2026-08-16T19:00:00Z",
          contexts: [context],
          projection_hash: `sha256:${"b".repeat(64)}`
        })
    ).toBe(true);
  });

  it.each([
    ["unknown schema", { ...context, schema: "travel-trip-context/v2" }],
    ["missing graph", { ...context, route_graph: undefined }],
    ["invalid brief", { ...context, destination_brief: { schema: "other" } }]
  ])("rejects $name", (_name, value) => {
    expect(() => decodeTravelTripContext(value)).toThrow(
      "Incompatible travel trip context"
    );
  });
});
