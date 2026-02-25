(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/lib/mock/flights.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "flightOffers",
    ()=>flightOffers,
    "scheduleEvents",
    ()=>scheduleEvents
]);
const flightOffers = [
    {
        id: "AF1001",
        flightNo: "AF1001",
        airline: "Airflow Atlantic",
        fromCode: "JFK",
        toCode: "LAX",
        departTime: "07:10",
        arriveTime: "10:40",
        duration: "5h 30m",
        stops: 0,
        priceUsd: 189,
        seatsLeft: 5
    },
    {
        id: "AF2204",
        flightNo: "AF2204",
        airline: "Airflow Atlantic",
        fromCode: "JFK",
        toCode: "SFO",
        departTime: "09:35",
        arriveTime: "13:10",
        duration: "6h 35m",
        stops: 1,
        priceUsd: 172,
        seatsLeft: 12
    },
    {
        id: "AF3320",
        flightNo: "AF3320",
        airline: "SkyBridge",
        fromCode: "ORD",
        toCode: "SEA",
        departTime: "11:50",
        arriveTime: "14:35",
        duration: "4h 45m",
        stops: 0,
        priceUsd: 211,
        seatsLeft: 4
    },
    {
        id: "AF4892",
        flightNo: "AF4892",
        airline: "JetNorth",
        fromCode: "MIA",
        toCode: "BOS",
        departTime: "15:20",
        arriveTime: "18:25",
        duration: "3h 05m",
        stops: 0,
        priceUsd: 134,
        seatsLeft: 18
    }
];
const scheduleEvents = [
    {
        id: "evt-1",
        title: "AF1001 JFK -> LAX",
        start: "2026-03-03T07:10:00",
        end: "2026-03-03T10:40:00",
        extendedProps: {
            gate: "A12",
            aircraft: "A321neo",
            status: "Boarding"
        }
    },
    {
        id: "evt-2",
        title: "AF2204 JFK -> SFO",
        start: "2026-03-04T09:35:00",
        end: "2026-03-04T13:10:00",
        extendedProps: {
            gate: "B4",
            aircraft: "B737-8",
            status: "On Time"
        }
    },
    {
        id: "evt-3",
        title: "AF3320 ORD -> SEA",
        start: "2026-03-05T11:50:00",
        end: "2026-03-05T14:35:00",
        extendedProps: {
            gate: "C9",
            aircraft: "A220-300",
            status: "Delayed"
        }
    },
    {
        id: "evt-4",
        title: "AF4892 MIA -> BOS",
        start: "2026-03-06T15:20:00",
        end: "2026-03-06T18:25:00",
        extendedProps: {
            gate: "D2",
            aircraft: "B737-9",
            status: "On Time"
        }
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/components/flights/schedule-calendar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ScheduleCalendar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$fullcalendar$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@fullcalendar/react/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$fullcalendar$2f$daygrid$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@fullcalendar/daygrid/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$fullcalendar$2f$timegrid$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@fullcalendar/timegrid/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$fullcalendar$2f$interaction$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/@fullcalendar/interaction/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$mock$2f$flights$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/lib/mock/flights.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function ScheduleCalendar() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                        className: "h-4 w-4 text-sky-600"
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/flights/schedule-calendar.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-base font-semibold text-slate-900",
                        children: "Weekly Schedule"
                    }, void 0, false, {
                        fileName: "[project]/frontend/components/flights/schedule-calendar.tsx",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/components/flights/schedule-calendar.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$fullcalendar$2f$react$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                plugins: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$fullcalendar$2f$daygrid$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
                    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$fullcalendar$2f$timegrid$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
                    __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f40$fullcalendar$2f$interaction$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
                ],
                initialView: "timeGridWeek",
                headerToolbar: {
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay"
                },
                events: __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$lib$2f$mock$2f$flights$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleEvents"],
                nowIndicator: true,
                editable: false,
                eventTimeFormat: {
                    hour: "2-digit",
                    minute: "2-digit",
                    meridiem: false
                },
                height: "auto"
            }, void 0, false, {
                fileName: "[project]/frontend/components/flights/schedule-calendar.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/components/flights/schedule-calendar.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_c = ScheduleCalendar;
var _c;
__turbopack_context__.k.register(_c, "ScheduleCalendar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend_d805b971._.js.map