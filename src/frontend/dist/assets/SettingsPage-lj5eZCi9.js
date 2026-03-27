import { r as reactExports, j as jsxRuntimeExports, k as ue, u as useUserProfile, v as usePersonalitySettings, a0 as useGetRulesOrdered, b as useMemories, $ as useUpdateUserProfile, A as useSetPersonalitySettings, z as useSetBehaviorRule, a1 as useUpdateRulePriority, _ as useDeleteBehaviorRule, w as useAddMemory, L as Link } from "./index-D4lUgCCM.js";
import { B as Badge } from "./badge-BMXMPn3_.js";
import { c as createLucideIcon, u as useComposedRefs, a as cn, B as Button } from "./createLucideIcon-a11X8bAo.js";
import { L as Label } from "./label-Bf9_XisY.js";
import { c as clamp } from "./index-IXOTxK3N.js";
import { u as useControllableState, d as createContextScope, j as createCollection, e as composeEventHandlers, g as useDirection, f as useSize, L as Layout, S as Settings } from "./Layout-y-fTRwTO.js";
import { u as usePrevious } from "./index-Cj4N10C2.js";
import { P as Primitive, G as GraduationCap } from "./proxy-CDDWEtkX.js";
import { S as Switch } from "./switch-DRk_tZ1N.js";
import { B as Briefcase, S as Smile, A as AlignLeft, F as Flame } from "./smile-Bil1VTXA.js";
import { Z as Zap } from "./zap-CRDejI0C.js";
import { C as Check } from "./check-CyKGSNZc.js";
import { L as LoaderCircle } from "./loader-circle-Tr-8VCUp.js";
import { M as MicOff } from "./mic-off-N3UQvSP9.js";
import { M as Mic } from "./mic-q3q9Ut1L.js";
import { a as ChevronUp, C as ChevronDown } from "./chevron-up-QZ-Q9T3F.js";
import { T as Trash2 } from "./trash-2-BvljEyqY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
var PAGE_KEYS = ["PageUp", "PageDown"];
var ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
var BACK_KEYS = {
  "from-left": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-right": ["Home", "PageDown", "ArrowDown", "ArrowRight"],
  "from-bottom": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-top": ["Home", "PageDown", "ArrowUp", "ArrowLeft"]
};
var SLIDER_NAME = "Slider";
var [Collection, useCollection, createCollectionScope] = createCollection(SLIDER_NAME);
var [createSliderContext] = createContextScope(SLIDER_NAME, [
  createCollectionScope
]);
var [SliderProvider, useSliderContext] = createSliderContext(SLIDER_NAME);
var Slider$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      name,
      min = 0,
      max = 100,
      step = 1,
      orientation = "horizontal",
      disabled = false,
      minStepsBetweenThumbs = 0,
      defaultValue = [min],
      value,
      onValueChange = () => {
      },
      onValueCommit = () => {
      },
      inverted = false,
      form,
      ...sliderProps
    } = props;
    const thumbRefs = reactExports.useRef(/* @__PURE__ */ new Set());
    const valueIndexToChangeRef = reactExports.useRef(0);
    const isHorizontal = orientation === "horizontal";
    const SliderOrientation = isHorizontal ? SliderHorizontal : SliderVertical;
    const [values = [], setValues] = useControllableState({
      prop: value,
      defaultProp: defaultValue,
      onChange: (value2) => {
        var _a;
        const thumbs = [...thumbRefs.current];
        (_a = thumbs[valueIndexToChangeRef.current]) == null ? void 0 : _a.focus();
        onValueChange(value2);
      }
    });
    const valuesBeforeSlideStartRef = reactExports.useRef(values);
    function handleSlideStart(value2) {
      const closestIndex = getClosestValueIndex(values, value2);
      updateValues(value2, closestIndex);
    }
    function handleSlideMove(value2) {
      updateValues(value2, valueIndexToChangeRef.current);
    }
    function handleSlideEnd() {
      const prevValue = valuesBeforeSlideStartRef.current[valueIndexToChangeRef.current];
      const nextValue = values[valueIndexToChangeRef.current];
      const hasChanged = nextValue !== prevValue;
      if (hasChanged) onValueCommit(values);
    }
    function updateValues(value2, atIndex, { commit } = { commit: false }) {
      const decimalCount = getDecimalCount(step);
      const snapToStep = roundValue(Math.round((value2 - min) / step) * step + min, decimalCount);
      const nextValue = clamp(snapToStep, [min, max]);
      setValues((prevValues = []) => {
        const nextValues = getNextSortedValues(prevValues, nextValue, atIndex);
        if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) {
          valueIndexToChangeRef.current = nextValues.indexOf(nextValue);
          const hasChanged = String(nextValues) !== String(prevValues);
          if (hasChanged && commit) onValueCommit(nextValues);
          return hasChanged ? nextValues : prevValues;
        } else {
          return prevValues;
        }
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SliderProvider,
      {
        scope: props.__scopeSlider,
        name,
        disabled,
        min,
        max,
        valueIndexToChangeRef,
        thumbs: thumbRefs.current,
        values,
        orientation,
        form,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeSlider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeSlider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderOrientation,
          {
            "aria-disabled": disabled,
            "data-disabled": disabled ? "" : void 0,
            ...sliderProps,
            ref: forwardedRef,
            onPointerDown: composeEventHandlers(sliderProps.onPointerDown, () => {
              if (!disabled) valuesBeforeSlideStartRef.current = values;
            }),
            min,
            max,
            inverted,
            onSlideStart: disabled ? void 0 : handleSlideStart,
            onSlideMove: disabled ? void 0 : handleSlideMove,
            onSlideEnd: disabled ? void 0 : handleSlideEnd,
            onHomeKeyDown: () => !disabled && updateValues(min, 0, { commit: true }),
            onEndKeyDown: () => !disabled && updateValues(max, values.length - 1, { commit: true }),
            onStepKeyDown: ({ event, direction: stepDirection }) => {
              if (!disabled) {
                const isPageKey = PAGE_KEYS.includes(event.key);
                const isSkipKey = isPageKey || event.shiftKey && ARROW_KEYS.includes(event.key);
                const multiplier = isSkipKey ? 10 : 1;
                const atIndex = valueIndexToChangeRef.current;
                const value2 = values[atIndex];
                const stepInDirection = step * multiplier * stepDirection;
                updateValues(value2 + stepInDirection, atIndex, { commit: true });
              }
            }
          }
        ) }) })
      }
    );
  }
);
Slider$1.displayName = SLIDER_NAME;
var [SliderOrientationProvider, useSliderOrientationContext] = createSliderContext(SLIDER_NAME, {
  startEdge: "left",
  endEdge: "right",
  size: "width",
  direction: 1
});
var SliderHorizontal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      min,
      max,
      dir,
      inverted,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const [slider, setSlider] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setSlider(node));
    const rectRef = reactExports.useRef(void 0);
    const direction = useDirection(dir);
    const isDirectionLTR = direction === "ltr";
    const isSlidingFromLeft = isDirectionLTR && !inverted || !isDirectionLTR && inverted;
    function getValueFromPointer(pointerPosition) {
      const rect = rectRef.current || slider.getBoundingClientRect();
      const input = [0, rect.width];
      const output = isSlidingFromLeft ? [min, max] : [max, min];
      const value = linearScale(input, output);
      rectRef.current = rect;
      return value(pointerPosition - rect.left);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SliderOrientationProvider,
      {
        scope: props.__scopeSlider,
        startEdge: isSlidingFromLeft ? "left" : "right",
        endEdge: isSlidingFromLeft ? "right" : "left",
        direction: isSlidingFromLeft ? 1 : -1,
        size: "width",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderImpl,
          {
            dir: direction,
            "data-orientation": "horizontal",
            ...sliderProps,
            ref: composedRefs,
            style: {
              ...sliderProps.style,
              ["--radix-slider-thumb-transform"]: "translateX(-50%)"
            },
            onSlideStart: (event) => {
              const value = getValueFromPointer(event.clientX);
              onSlideStart == null ? void 0 : onSlideStart(value);
            },
            onSlideMove: (event) => {
              const value = getValueFromPointer(event.clientX);
              onSlideMove == null ? void 0 : onSlideMove(value);
            },
            onSlideEnd: () => {
              rectRef.current = void 0;
              onSlideEnd == null ? void 0 : onSlideEnd();
            },
            onStepKeyDown: (event) => {
              const slideDirection = isSlidingFromLeft ? "from-left" : "from-right";
              const isBackKey = BACK_KEYS[slideDirection].includes(event.key);
              onStepKeyDown == null ? void 0 : onStepKeyDown({ event, direction: isBackKey ? -1 : 1 });
            }
          }
        )
      }
    );
  }
);
var SliderVertical = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      min,
      max,
      inverted,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const sliderRef = reactExports.useRef(null);
    const ref = useComposedRefs(forwardedRef, sliderRef);
    const rectRef = reactExports.useRef(void 0);
    const isSlidingFromBottom = !inverted;
    function getValueFromPointer(pointerPosition) {
      const rect = rectRef.current || sliderRef.current.getBoundingClientRect();
      const input = [0, rect.height];
      const output = isSlidingFromBottom ? [max, min] : [min, max];
      const value = linearScale(input, output);
      rectRef.current = rect;
      return value(pointerPosition - rect.top);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SliderOrientationProvider,
      {
        scope: props.__scopeSlider,
        startEdge: isSlidingFromBottom ? "bottom" : "top",
        endEdge: isSlidingFromBottom ? "top" : "bottom",
        size: "height",
        direction: isSlidingFromBottom ? 1 : -1,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderImpl,
          {
            "data-orientation": "vertical",
            ...sliderProps,
            ref,
            style: {
              ...sliderProps.style,
              ["--radix-slider-thumb-transform"]: "translateY(50%)"
            },
            onSlideStart: (event) => {
              const value = getValueFromPointer(event.clientY);
              onSlideStart == null ? void 0 : onSlideStart(value);
            },
            onSlideMove: (event) => {
              const value = getValueFromPointer(event.clientY);
              onSlideMove == null ? void 0 : onSlideMove(value);
            },
            onSlideEnd: () => {
              rectRef.current = void 0;
              onSlideEnd == null ? void 0 : onSlideEnd();
            },
            onStepKeyDown: (event) => {
              const slideDirection = isSlidingFromBottom ? "from-bottom" : "from-top";
              const isBackKey = BACK_KEYS[slideDirection].includes(event.key);
              onStepKeyDown == null ? void 0 : onStepKeyDown({ event, direction: isBackKey ? -1 : 1 });
            }
          }
        )
      }
    );
  }
);
var SliderImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSlider,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onHomeKeyDown,
      onEndKeyDown,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const context = useSliderContext(SLIDER_NAME, __scopeSlider);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        ...sliderProps,
        ref: forwardedRef,
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          if (event.key === "Home") {
            onHomeKeyDown(event);
            event.preventDefault();
          } else if (event.key === "End") {
            onEndKeyDown(event);
            event.preventDefault();
          } else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
            onStepKeyDown(event);
            event.preventDefault();
          }
        }),
        onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
          const target = event.target;
          target.setPointerCapture(event.pointerId);
          event.preventDefault();
          if (context.thumbs.has(target)) {
            target.focus();
          } else {
            onSlideStart(event);
          }
        }),
        onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) onSlideMove(event);
        }),
        onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) {
            target.releasePointerCapture(event.pointerId);
            onSlideEnd(event);
          }
        })
      }
    );
  }
);
var TRACK_NAME = "SliderTrack";
var SliderTrack = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, ...trackProps } = props;
    const context = useSliderContext(TRACK_NAME, __scopeSlider);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-disabled": context.disabled ? "" : void 0,
        "data-orientation": context.orientation,
        ...trackProps,
        ref: forwardedRef
      }
    );
  }
);
SliderTrack.displayName = TRACK_NAME;
var RANGE_NAME = "SliderRange";
var SliderRange = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, ...rangeProps } = props;
    const context = useSliderContext(RANGE_NAME, __scopeSlider);
    const orientation = useSliderOrientationContext(RANGE_NAME, __scopeSlider);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const valuesCount = context.values.length;
    const percentages = context.values.map(
      (value) => convertValueToPercentage(value, context.min, context.max)
    );
    const offsetStart = valuesCount > 1 ? Math.min(...percentages) : 0;
    const offsetEnd = 100 - Math.max(...percentages);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-orientation": context.orientation,
        "data-disabled": context.disabled ? "" : void 0,
        ...rangeProps,
        ref: composedRefs,
        style: {
          ...props.style,
          [orientation.startEdge]: offsetStart + "%",
          [orientation.endEdge]: offsetEnd + "%"
        }
      }
    );
  }
);
SliderRange.displayName = RANGE_NAME;
var THUMB_NAME = "SliderThumb";
var SliderThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const getItems = useCollection(props.__scopeSlider);
    const [thumb, setThumb] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
    const index = reactExports.useMemo(
      () => thumb ? getItems().findIndex((item) => item.ref.current === thumb) : -1,
      [getItems, thumb]
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SliderThumbImpl, { ...props, ref: composedRefs, index });
  }
);
var SliderThumbImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, index, name, ...thumbProps } = props;
    const context = useSliderContext(THUMB_NAME, __scopeSlider);
    const orientation = useSliderOrientationContext(THUMB_NAME, __scopeSlider);
    const [thumb, setThumb] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
    const isFormControl = thumb ? context.form || !!thumb.closest("form") : true;
    const size = useSize(thumb);
    const value = context.values[index];
    const percent = value === void 0 ? 0 : convertValueToPercentage(value, context.min, context.max);
    const label = getLabel(index, context.values.length);
    const orientationSize = size == null ? void 0 : size[orientation.size];
    const thumbInBoundsOffset = orientationSize ? getThumbInBoundsOffset(orientationSize, percent, orientation.direction) : 0;
    reactExports.useEffect(() => {
      if (thumb) {
        context.thumbs.add(thumb);
        return () => {
          context.thumbs.delete(thumb);
        };
      }
    }, [thumb, context.thumbs]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        style: {
          transform: "var(--radix-slider-thumb-transform)",
          position: "absolute",
          [orientation.startEdge]: `calc(${percent}% + ${thumbInBoundsOffset}px)`
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.ItemSlot, { scope: props.__scopeSlider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive.span,
            {
              role: "slider",
              "aria-label": props["aria-label"] || label,
              "aria-valuemin": context.min,
              "aria-valuenow": value,
              "aria-valuemax": context.max,
              "aria-orientation": context.orientation,
              "data-orientation": context.orientation,
              "data-disabled": context.disabled ? "" : void 0,
              tabIndex: context.disabled ? void 0 : 0,
              ...thumbProps,
              ref: composedRefs,
              style: value === void 0 ? { display: "none" } : props.style,
              onFocus: composeEventHandlers(props.onFocus, () => {
                context.valueIndexToChangeRef.current = index;
              })
            }
          ) }),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            SliderBubbleInput,
            {
              name: name ?? (context.name ? context.name + (context.values.length > 1 ? "[]" : "") : void 0),
              form: context.form,
              value
            },
            index
          )
        ]
      }
    );
  }
);
SliderThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "RadioBubbleInput";
var SliderBubbleInput = reactExports.forwardRef(
  ({ __scopeSlider, value, ...props }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevValue = usePrevious(value);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(inputProto, "value");
      const setValue = descriptor.set;
      if (prevValue !== value && setValue) {
        const event = new Event("input", { bubbles: true });
        setValue.call(input, value);
        input.dispatchEvent(event);
      }
    }, [prevValue, value]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        style: { display: "none" },
        ...props,
        ref: composedRefs,
        defaultValue: value
      }
    );
  }
);
SliderBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getNextSortedValues(prevValues = [], nextValue, atIndex) {
  const nextValues = [...prevValues];
  nextValues[atIndex] = nextValue;
  return nextValues.sort((a, b) => a - b);
}
function convertValueToPercentage(value, min, max) {
  const maxSteps = max - min;
  const percentPerStep = 100 / maxSteps;
  const percentage = percentPerStep * (value - min);
  return clamp(percentage, [0, 100]);
}
function getLabel(index, totalValues) {
  if (totalValues > 2) {
    return `Value ${index + 1} of ${totalValues}`;
  } else if (totalValues === 2) {
    return ["Minimum", "Maximum"][index];
  } else {
    return void 0;
  }
}
function getClosestValueIndex(values, nextValue) {
  if (values.length === 1) return 0;
  const distances = values.map((value) => Math.abs(value - nextValue));
  const closestDistance = Math.min(...distances);
  return distances.indexOf(closestDistance);
}
function getThumbInBoundsOffset(width, left, direction) {
  const halfWidth = width / 2;
  const halfPercent = 50;
  const offset = linearScale([0, halfPercent], [0, halfWidth]);
  return (halfWidth - offset(left) * direction) * direction;
}
function getStepsBetweenValues(values) {
  return values.slice(0, -1).map((value, index) => values[index + 1] - value);
}
function hasMinStepsBetweenValues(values, minStepsBetweenValues) {
  if (minStepsBetweenValues > 0) {
    const stepsBetweenValues = getStepsBetweenValues(values);
    const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues);
    return actualMinStepsBetweenValues >= minStepsBetweenValues;
  }
  return true;
}
function linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function getDecimalCount(value) {
  return (String(value).split(".")[1] || "").length;
}
function roundValue(value, decimalCount) {
  const rounder = Math.pow(10, decimalCount);
  return Math.round(value * rounder) / rounder;
}
var Root = Slider$1;
var Track = SliderTrack;
var Range = SliderRange;
var Thumb = SliderThumb;
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}) {
  const _values = reactExports.useMemo(
    () => Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max],
    [value, defaultValue, min, max]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Root,
    {
      "data-slot": "slider",
      defaultValue,
      value,
      min,
      max,
      className: cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Track,
          {
            "data-slot": "slider-track",
            className: cn(
              "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Range,
              {
                "data-slot": "slider-range",
                className: cn(
                  "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
                )
              }
            )
          }
        ),
        Array.from({ length: _values.length }, (value2, _) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Thumb,
          {
            "data-slot": "slider-thumb",
            className: "border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          },
          `${value2}`
        ))
      ]
    }
  );
}
function isSpeechRecognitionSupported() {
  return typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}
function useSpeechRecognition({
  onResult,
  onError,
  onEnd,
  lang = "en-US"
}) {
  const [isListening, setIsListening] = reactExports.useState(false);
  const recognitionRef = reactExports.useRef(null);
  const onResultRef = reactExports.useRef(onResult);
  const onErrorRef = reactExports.useRef(onError);
  const onEndRef = reactExports.useRef(onEnd);
  onResultRef.current = onResult;
  onErrorRef.current = onError;
  onEndRef.current = onEnd;
  const isSupported = isSpeechRecognitionSupported();
  const stop = reactExports.useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);
  const start = reactExports.useCallback(() => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      ue.error("Speech recognition not supported. Try Chrome or Edge.");
      return;
    }
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang;
    recognitionRef.current = recognition;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      onResultRef.current(transcript);
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      const errCode = event.error;
      if (onErrorRef.current) {
        onErrorRef.current(errCode);
      } else {
        if (errCode === "not-allowed") {
          ue.error(
            "Microphone access denied. Please allow access in your browser settings."
          );
        } else if (errCode === "no-speech") ;
        else if (errCode === "audio-capture") {
          ue.error("No microphone detected. Please check your device.");
        } else if (errCode === "network") {
          ue.error(
            "Network error during speech recognition. Check your connection."
          );
        } else {
          ue.error("Voice recognition error. Please try again.");
        }
      }
    };
    recognition.onend = () => {
      var _a;
      setIsListening(false);
      (_a = onEndRef.current) == null ? void 0 : _a.call(onEndRef);
    };
    recognition.start();
  }, [lang]);
  reactExports.useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);
  return { isListening, start, stop, isSupported };
}
const PERSONALITIES = [
  {
    id: "professional",
    label: "Professional",
    icon: Briefcase,
    desc: "Formal, structured, task-focused",
    rules: [
      "Use formal language always",
      "Start with the key point",
      "Provide structured responses with clear sections"
    ]
  },
  {
    id: "friendly",
    label: "Friendly",
    icon: Smile,
    desc: "Warm, supportive, approachable",
    rules: [
      "Use warm and encouraging tone",
      "Add supportive acknowledgments",
      "Be conversational and personal"
    ]
  },
  {
    id: "witty",
    label: "Witty",
    icon: Zap,
    desc: "Sharp, clever, with humor",
    rules: [
      "Include clever observations when appropriate",
      "Use wordplay and humor occasionally",
      "Be insightful and entertaining"
    ]
  },
  {
    id: "concise",
    label: "Concise",
    icon: AlignLeft,
    desc: "Brief, direct, no filler",
    rules: [
      "Keep all responses under 3 sentences",
      "Use bullet points only",
      "No preamble or filler phrases"
    ]
  },
  {
    id: "mentor",
    label: "Mentor",
    icon: GraduationCap,
    desc: "Guiding, educational, thoughtful",
    rules: [
      "Explain the reasoning behind every answer",
      "Provide step-by-step guidance",
      "Give examples to illustrate concepts"
    ]
  },
  {
    id: "motivator",
    label: "Motivator",
    icon: Flame,
    desc: "Energetic, encouraging, action-oriented",
    rules: [
      "Use energetic and uplifting language",
      "End every response with a next action step",
      "Celebrate progress and effort"
    ]
  }
];
const RULE_TEMPLATES = [
  {
    id: "business",
    name: "Business Mode",
    emoji: "🏢",
    desc: "Formal, structured, data-driven",
    rules: [
      "Use formal language and professional tone",
      "Structure responses with clear headings",
      "Support statements with data when available",
      "Start every response with the key takeaway"
    ]
  },
  {
    id: "creative",
    name: "Creative Mode",
    emoji: "🎨",
    desc: "Imaginative, exploratory, experimental",
    rules: [
      "Use vivid metaphors and analogies",
      "Explore unconventional ideas and perspectives",
      "Encourage creative experimentation",
      "Embrace ambiguity and open-ended thinking"
    ]
  },
  {
    id: "quick",
    name: "Quick Mode",
    emoji: "⚡",
    desc: "Ultra-brief, bullet points only",
    rules: [
      "Respond only in bullet points",
      "Maximum 3 items per response",
      "No preamble, no filler, no pleasantries"
    ]
  },
  {
    id: "teacher",
    name: "Teacher Mode",
    emoji: "📚",
    desc: "Step-by-step, thorough, with examples",
    rules: [
      "Break down every answer step by step",
      "Define all technical terms simply",
      "Give at least one concrete example per concept",
      "Check understanding by summarizing key points"
    ]
  }
];
const QUICK_RULE_SHORTCUTS = [
  "Always respond in bullet points",
  "Keep responses under 3 sentences",
  "Use formal language",
  "Always greet me by name",
  "Explain technical terms simply",
  "Give examples in every response",
  "Start with the most important point",
  "End with next action steps"
];
function SettingsPage() {
  const { data: profile } = useUserProfile();
  const { data: personality } = usePersonalitySettings();
  const { data: rulesOrdered = [] } = useGetRulesOrdered();
  const { data: memories = [] } = useMemories();
  useUpdateUserProfile();
  const setPersonalityFn = useSetPersonalitySettings();
  const setBehaviorRule = useSetBehaviorRule();
  const updateRulePriority = useUpdateRulePriority();
  const deleteRule = useDeleteBehaviorRule();
  useAddMemory();
  const hasInitialized = reactExports.useRef(false);
  const hasPersonalityInitialized = reactExports.useRef(false);
  const [editName, setEditName] = reactExports.useState("");
  const [editProfession, setEditProfession] = reactExports.useState("");
  const [editLocation, setEditLocation] = reactExports.useState("");
  const [editGoal, setEditGoal] = reactExports.useState("");
  const [editInterests, setEditInterests] = reactExports.useState("");
  const [editWorkStyle, _setEditWorkStyle] = reactExports.useState("solo");
  const [editProjects, setEditProjects] = reactExports.useState("");
  const [_isSavingProfile, _setIsSavingProfile] = reactExports.useState(false);
  const [formalitySlider, setFormalitySlider] = reactExports.useState([50]);
  const [lengthSlider, setLengthSlider] = reactExports.useState([50]);
  const [useMarkdown, setUseMarkdown] = reactExports.useState(false);
  const [includeExamples, setIncludeExamples] = reactExports.useState(false);
  const [showConfidence, setShowConfidence] = reactExports.useState(false);
  const [voiceTranscript, setVoiceTranscript] = reactExports.useState("");
  const [isSavingVoiceRule, setIsSavingVoiceRule] = reactExports.useState(false);
  const [proactiveMode, setProactiveModeState] = reactExports.useState(
    () => localStorage.getItem("dj_proactive_mode") !== "false"
  );
  const [wakeWordEnabled, setWakeWordEnabledState] = reactExports.useState(
    () => localStorage.getItem("dj_wake_word_enabled") !== "false"
  );
  const [continuousListening, setContinuousListeningState] = reactExports.useState(
    () => localStorage.getItem("dj_continuous_listening") === "true"
  );
  const [autonomySuggestions, setAutonomySuggestionsState] = reactExports.useState(
    () => localStorage.getItem("dj_autonomy_suggestions") !== "false"
  );
  const handleProactiveMode = (v) => {
    setProactiveModeState(v);
    localStorage.setItem("dj_proactive_mode", String(v));
    window.dispatchEvent(
      new CustomEvent("dj-settings-changed", {
        detail: { key: "dj_proactive_mode", value: v }
      })
    );
  };
  const handleWakeWordEnabled = (v) => {
    setWakeWordEnabledState(v);
    localStorage.setItem("dj_wake_word_enabled", String(v));
    window.dispatchEvent(
      new CustomEvent("dj-settings-changed", {
        detail: { key: "dj_wake_word_enabled", value: v }
      })
    );
  };
  const handleContinuousListening = (v) => {
    setContinuousListeningState(v);
    localStorage.setItem("dj_continuous_listening", String(v));
    window.dispatchEvent(
      new CustomEvent("dj-settings-changed", {
        detail: { key: "dj_continuous_listening", value: v }
      })
    );
  };
  function handleAutonomySuggestions(v) {
    setAutonomySuggestionsState(v);
    localStorage.setItem("dj_autonomy_suggestions", String(v));
    window.dispatchEvent(
      new CustomEvent("dj-settings-changed", {
        detail: { key: "dj_autonomy_suggestions", value: v }
      })
    );
  }
  const [appliedTemplates, setAppliedTemplates] = reactExports.useState([]);
  const [applyingTemplate, setApplyingTemplate] = reactExports.useState(null);
  const [activePersonality, setActivePersonality] = reactExports.useState("professional");
  reactExports.useEffect(() => {
    if (profile && !hasInitialized.current) {
      hasInitialized.current = true;
      setEditName(profile.name || "");
      const prefs = profile.preferences || "";
      const extract = (key) => {
        const match = prefs.match(new RegExp(`${key}:\\s*([^\\n]+)`));
        return match ? match[1].trim() : "";
      };
      const prof = extract("Profession");
      const loc = extract("Location");
      const goal = extract("Main goal");
      const interests = extract("Interests");
      const projects = extract("Current projects");
      if (prof) setEditProfession(prof);
      if (loc) setEditLocation(loc);
      if (goal) setEditGoal(goal);
      if (interests) setEditInterests(interests);
      if (projects) setEditProjects(projects);
    }
  }, [profile]);
  reactExports.useEffect(() => {
    if (personality && !hasPersonalityInitialized.current) {
      hasPersonalityInitialized.current = true;
      setActivePersonality(personality.communicationStyle);
    }
  }, [personality]);
  const handlePersonalitySelect = async (id) => {
    setActivePersonality(id);
    const p = PERSONALITIES.find((p2) => p2.id === id);
    if (!p) return;
    try {
      await setPersonalityFn.mutateAsync(id);
      hasPersonalityInitialized.current = true;
      for (let i = 0; i < p.rules.length; i++) {
        await setBehaviorRule.mutateAsync({
          ruleText: p.rules[i],
          priority: BigInt(rulesOrdered.length + i + 1)
        });
      }
      ue.success(`${p.label} mode activated`);
    } catch (_e) {
      ue.error("Failed to apply personality");
    }
  };
  const handleApplyTemplate = async (template) => {
    setApplyingTemplate(template.id);
    try {
      for (let i = 0; i < template.rules.length; i++) {
        await setBehaviorRule.mutateAsync({
          ruleText: template.rules[i],
          priority: BigInt(rulesOrdered.length + i + 1)
        });
      }
      setAppliedTemplates((prev) => [...prev, template.id]);
      ue.success(
        `${template.name} applied — ${template.rules.length} rules added`
      );
    } catch (_e) {
      ue.error("Failed to apply template");
    } finally {
      setApplyingTemplate(null);
    }
  };
  const handleQuickRuleToggle = async (ruleText) => {
    const isActive = rulesOrdered.some((r) => r.ruleText === ruleText);
    if (!isActive) {
      try {
        await setBehaviorRule.mutateAsync({
          ruleText,
          priority: BigInt(rulesOrdered.length + 1)
        });
        ue.success("Rule added");
      } catch (_e) {
        ue.error("Failed to add rule");
      }
    } else {
      ue.info(
        "This rule is already active. Visit the rules list below to remove it."
      );
    }
  };
  const handleSaveStyleSettings = async () => {
    const rules = [];
    if (formalitySlider[0] < 30)
      rules.push("Use casual, conversational language");
    else if (formalitySlider[0] > 70)
      rules.push("Use formal, professional language");
    if (lengthSlider[0] < 30)
      rules.push("Keep responses very brief — one sentence max");
    else if (lengthSlider[0] > 70)
      rules.push("Provide detailed, comprehensive responses");
    if (useMarkdown) rules.push("Always use markdown formatting in responses");
    if (includeExamples)
      rules.push("Include relevant examples in every response");
    if (showConfidence)
      rules.push("Indicate your confidence level at the end of each response");
    try {
      for (let i = 0; i < rules.length; i++) {
        await setBehaviorRule.mutateAsync({
          ruleText: rules[i],
          priority: BigInt(rulesOrdered.length + i + 1)
        });
      }
      ue.success("Style settings saved as rules");
    } catch (_e) {
      ue.error("Failed to save settings");
    }
  };
  const handleMoveRule = async (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === rulesOrdered.length - 1) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    const ruleA = rulesOrdered[index];
    const ruleB = rulesOrdered[swapIndex];
    try {
      await Promise.all([
        updateRulePriority.mutateAsync({
          id: ruleA.id,
          newPriority: ruleB.priority
        }),
        updateRulePriority.mutateAsync({
          id: ruleB.id,
          newPriority: ruleA.priority
        })
      ]);
    } catch (_e) {
      ue.error("Failed to reorder rules");
    }
  };
  const handleDeleteRule = async (id) => {
    try {
      await deleteRule.mutateAsync(id);
      ue.success("Rule removed");
    } catch (_e) {
      ue.error("Failed to delete rule");
    }
  };
  const { isListening: isVoiceListening, start: startVoiceCapture } = useSpeechRecognition({
    onResult: (transcript) => {
      setVoiceTranscript(transcript);
    }
  });
  const handleSaveVoiceRule = async () => {
    if (!voiceTranscript.trim()) return;
    setIsSavingVoiceRule(true);
    try {
      await setBehaviorRule.mutateAsync({
        ruleText: voiceTranscript.trim(),
        priority: BigInt(rulesOrdered.length + 1)
      });
      ue.success("Voice rule saved!");
      setVoiceTranscript("");
    } catch (_e) {
      ue.error("Failed to save rule");
    } finally {
      setIsSavingVoiceRule(false);
    }
  };
  const initials = ((profile == null ? void 0 : profile.name) || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const Section = ({
    title,
    children
  }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground border-b border-primary/20 pb-2", children: title }),
    children
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-2xl space-y-10 px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "glow-text font-display text-3xl font-bold", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Configure DJ's personality, rules, and your profile" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "DJ Profile Card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-xl border border-primary/30 bg-gradient-to-br from-card to-muted/30 p-6",
        style: { boxShadow: "0 0 20px oklch(0.65 0.25 220 / 0.15)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 font-display text-xl font-bold text-primary",
              style: { boxShadow: "0 0 15px oklch(0.65 0.25 220 / 0.5)" },
              children: initials
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold truncate", children: (profile == null ? void 0 : profile.name) || "User" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/20 text-primary border-primary/40 capitalize", children: activePersonality })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                rulesOrdered.length,
                " rules active"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                memories.length,
                " memories stored"
              ] })
            ] })
          ] })
        ] })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "DJ Mood Board", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Choose DJ's personality style. Selecting one applies a matching rule bundle." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: PERSONALITIES.map(({ id, label, icon: Icon, desc }) => {
        const isActive = activePersonality === id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            tabIndex: -1,
            onClick: () => handlePersonalitySelect(id),
            className: `relative flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all ${isActive ? "border-primary bg-primary/15 shadow-mood-active" : "border-muted bg-card/30 hover:border-primary/40"}`,
            children: [
              isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-2.5 w-2.5 text-primary-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `flex h-9 w-9 items-center justify-center rounded-md ${isActive ? "bg-primary/25" : "bg-muted"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Icon,
                    {
                      className: `h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: `text-sm font-semibold ${isActive ? "text-primary" : ""}`,
                    children: label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-tight", children: desc })
              ] })
            ]
          },
          id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Rule Template Library", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Apply a pre-built rule pack in one tap." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: RULE_TEMPLATES.map((template) => {
        const applied = appliedTemplates.includes(template.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-lg border border-muted bg-card/40 p-4",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: template.emoji }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: template.name }),
                  applied && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/20 text-primary border-primary/30 text-xs", children: "Applied" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: template.desc }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-2 space-y-0.5", children: template.rules.map((rule) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "li",
                  {
                    className: "flex items-center gap-1.5 text-xs text-muted-foreground",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-primary/60 shrink-0" }),
                      rule
                    ]
                  },
                  rule
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: applied ? "outline" : "default",
                  className: applied ? "border-primary/40 text-primary" : "bg-primary",
                  onClick: () => handleApplyTemplate(template),
                  disabled: applyingTemplate === template.id,
                  children: applyingTemplate === template.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : applied ? "Re-apply" : "Apply"
                }
              )
            ] })
          },
          template.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Quick Rule Shortcuts", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Tap to add a common rule instantly." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: QUICK_RULE_SHORTCUTS.map((rule) => {
        const isActive = rulesOrdered.some((r) => r.ruleText === rule);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => handleQuickRuleToggle(rule),
            className: `flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all ${isActive ? "border-primary bg-primary/15 text-foreground" : "border-muted bg-card/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"}`,
            style: isActive ? { boxShadow: "0 0 8px oklch(0.65 0.25 220 / 0.25)" } : {},
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `flex h-5 w-5 shrink-0 items-center justify-center rounded border ${isActive ? "border-primary bg-primary" : "border-muted"}`,
                  children: isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-primary-foreground" })
                }
              ),
              rule
            ]
          },
          rule
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Response Style", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 rounded-lg border border-muted bg-card/30 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Casual" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Formality" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Formal" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Slider,
          {
            value: formalitySlider,
            onValueChange: setFormalitySlider,
            min: 0,
            max: 100,
            step: 10,
            className: "w-full"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Brief" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Response Length" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Detailed" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Slider,
          {
            value: lengthSlider,
            onValueChange: setLengthSlider,
            min: 0,
            max: 100,
            step: 10,
            className: "w-full"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [
        {
          label: "Always use markdown formatting",
          value: useMarkdown,
          onChange: setUseMarkdown
        },
        {
          label: "Include relevant examples",
          value: includeExamples,
          onChange: setIncludeExamples
        },
        {
          label: "Show confidence level",
          value: showConfidence,
          onChange: setShowConfidence
        }
      ].map(({ label, value, onChange }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm text-muted-foreground", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: value, onCheckedChange: onChange })
      ] }, label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "w-full bg-primary/80 hover:bg-primary",
          onClick: handleSaveStyleSettings,
          children: "Save Style as Rules"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Tell DJ About Yourself", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 rounded-lg border border-muted bg-card/30 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "These details can only be updated through the Teach DJ module." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Your Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm text-foreground font-medium min-h-[1.5rem]",
              "data-ocid": "settings.name.panel",
              children: editName || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground italic", children: "Not set" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Profession / Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm text-foreground font-medium min-h-[1.5rem]",
              "data-ocid": "settings.profession.panel",
              children: editProfession || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground italic", children: "Not set" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Location" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm text-foreground font-medium min-h-[1.5rem]",
              "data-ocid": "settings.location.panel",
              children: editLocation || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground italic", children: "Not set" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Main Goal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm text-foreground font-medium min-h-[1.5rem]",
              "data-ocid": "settings.goal.panel",
              children: editGoal || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground italic", children: "Not set" })
            }
          )
        ] })
      ] }),
      editInterests && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Key Interests" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-sm text-foreground font-medium",
            "data-ocid": "settings.interests.panel",
            children: editInterests
          }
        )
      ] }),
      editWorkStyle && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Work Style" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-sm text-foreground font-medium capitalize",
            "data-ocid": "settings.workstyle.panel",
            children: editWorkStyle
          }
        )
      ] }),
      editProjects && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Current Projects" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-sm text-foreground font-medium",
            "data-ocid": "settings.projects.panel",
            children: editProjects
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/teach", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "w-full",
          variant: "outline",
          style: {
            borderColor: "oklch(0.65 0.25 220 / 0.5)",
            color: "oklch(0.65 0.25 220)"
          },
          "data-ocid": "settings.profile.edit_button",
          children: "Edit in Teach DJ"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Voice-to-Rule Capture", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-muted bg-card/30 p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: 'Speak a rule naturally and DJ will save it. Say things like "I like short answers" or "always be direct."' }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: startVoiceCapture,
            disabled: isVoiceListening,
            className: `flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all ${isVoiceListening ? "border-primary bg-primary/20 animate-pulse" : "border-primary/50 bg-card hover:border-primary hover:bg-primary/10"}`,
            style: {
              boxShadow: isVoiceListening ? "0 0 20px oklch(0.65 0.25 220 / 0.6)" : ""
            },
            children: isVoiceListening ? /* @__PURE__ */ jsxRuntimeExports.jsx(MicOff, { className: "h-7 w-7 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-7 w-7 text-primary" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isVoiceListening ? "Listening... speak your rule" : "Tap to speak a rule" })
      ] }),
      voiceTranscript && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-primary/30 bg-primary/10 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Transcribed rule:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium", children: [
          '"',
          voiceTranscript,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "mt-3 w-full bg-primary",
            size: "sm",
            onClick: handleSaveVoiceRule,
            disabled: isSavingVoiceRule,
            children: isSavingVoiceRule ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-3 w-3 animate-spin" }),
              " ",
              "Saving..."
            ] }) : "Save as Rule"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Assistant Behavior", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: "Enable Proactive Mode" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "DJ proactively notifies you about tasks, reminders, and knowledge updates." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            checked: proactiveMode,
            onCheckedChange: handleProactiveMode,
            "data-ocid": "settings.proactive_mode.switch"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: "Enable Voice Wake Word" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: 'Say "Hey DJ" to activate voice input hands-free.' })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            checked: wakeWordEnabled,
            onCheckedChange: handleWakeWordEnabled,
            "data-ocid": "settings.wake_word.switch"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: "Enable Continuous Listening" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Keep the microphone active after each response." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            checked: continuousListening,
            onCheckedChange: handleContinuousListening,
            "data-ocid": "settings.continuous_listening.switch"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: "Enable Autonomy Suggestions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "DJ periodically reviews your goals, plans, and habits to suggest next steps." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            checked: autonomySuggestions,
            onCheckedChange: handleAutonomySuggestions,
            "data-ocid": "settings.autonomy_suggestions.switch"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Prioritize Rules", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Use the arrows to reorder rules by importance. DJ follows higher-priority rules first when there's a conflict." }),
      rulesOrdered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-muted bg-card/30 p-6 text-center text-muted-foreground text-sm", children: "No rules yet. Add some using the shortcuts above or via Chat." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: rulesOrdered.map((rule, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3 rounded-lg border border-muted bg-card/40 px-4 py-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 flex-col gap-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleMoveRule(index, "up"),
                  disabled: index === 0,
                  className: "flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleMoveRule(index, "down"),
                  disabled: index === rulesOrdered.length - 1,
                  className: "flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/20 text-xs font-bold text-primary", children: index + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "flex-1 text-sm min-w-0 truncate", children: rule.ruleText }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => handleDeleteRule(rule.id),
                className: "shrink-0 text-muted-foreground hover:text-destructive transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ]
        },
        rule.id.toString()
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-6 pb-8 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/teach",
          className: "flex items-center gap-1 hover:text-primary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-3.5 w-3.5" }),
            "Teach DJ (Story Mode)"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/profile",
          className: "flex items-center gap-1 hover:text-primary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
            "View Profile"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-1 hover:text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-3.5 w-3.5" }),
        "Dashboard"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-4 text-center text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      ".",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
          className: "hover:text-primary",
          target: "_blank",
          rel: "noreferrer",
          children: "Built with love using caffeine.ai"
        }
      )
    ] })
  ] }) });
}
export {
  SettingsPage
};
