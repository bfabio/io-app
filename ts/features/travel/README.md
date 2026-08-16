# Travel context

This feature currently owns only the runtime contract for the read-only
`travel-trip-context/v1` projection produced by routines.

The decoder fails closed on incompatible payloads. It must not turn malformed
or missing routing data into an empty, apparently complete trip. Booking and
purchase commands are intentionally outside this contract; future local-guide
screens can consume the trip graph, destination briefing and phrasebook after
their product flow is defined.
