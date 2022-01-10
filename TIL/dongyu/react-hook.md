react hook에 더 친숙해지기 위해 nomadcoders의 "실전형 리액트 Hooks 10개" 강의를 듣고 useState와 useEffect를 사용하여 몇가지 훅들을 따라 만들었다.

#### useInput

> ```jsx
> const useInput = (initialValue, validator) => {
>   const [value, setValue] = useState(initialValue);
>   const onChange = (event) => {
>     const {target: {value}} = event;
>     let willUpdate = true;
>     if(typeof validator === "function") {
>       willUpdate = validator(value);
>     }
>     if(willUpdate) {
>       setValue(value);
>     }
>   };
>   return {value, onChange};
> };
> ```

#### useTabs

> ```jsx
> const useTabs = (initialTab, allTabs) => {
>   const [currentIndex, setCurrentIndex] = useState(initialTab);
>   if(!allTabs || !Array.isArray(allTabs)) {
>     return;
>   }
>   return {
>     currentItem: allTabs[currentIndex],
>     changeItem: setCurrentIndex
>   };
> };
> ```

#### useTitle

> ```jsx
> const useTitle = (initialTitle) => {
>   const [title, setTitle] = useState(initialTitle);
>   const updateTitle = () => {
>     const htmlTitle = document.querySelector("title");
>     htmlTitle.innerText = title;
>   }
>   useEffect(updateTitle, [title]);
>   return setTitle;
> };
> ```

#### useClick

> ```jsx
> const useClick = (onClick) => {
>   const element = useRef();
>   useEffect(() => {
>     if(typeof onClick !== "function") return;
>     if(element.current) {
>       element.current.addEventListener("click", onClick);
>     }
>     return () => {
>       if(element.current) {
>         element.current.removeEventListener("click", onClick);
>       }
>     }
>   }, [])
>   return typeof onClick === "function" ? element : undefined;
> };
> ```
>
> useEffect에 dependency로 []를 사용하면, mount될때는 return 전에 코드를 작성하고, unmount될때는 return에 함수 코드를 작성한다.

#### useConfirm

> ```jsx
> const useConfirm = (message = "", onConfirm, onCancel) => {
>   if(!onConfirm || typeof onConfirm !== "function") return;
>   if(!onCancel || typeof onCancel !== "function") return;
>   const confirmAction = () => {
>     if(window.confirm(message)) {
>       onConfirm();
>     }else {
>       onCancel();
>     }
>   }
>   return confirmAction;
> };
> ```

#### usePreventLeave

> ```jsx
> const usePreventLeave = () => {
>   const listener = event => {
>     event.preventDefault();
>     event.returnValue = "";
>   };
>   const enablePrevent = () => window.addEventListener("beforeunload", listener);
>   const disablePrevent = () => window.removeEventListener("beforeunload", listener);
>   return {enablePrevent, disablePrevent};
> };
> ```

#### useBeforeLeave

> ```jsx
> const useBeforeLeave = (onBefore) => {
>   const handle = (event) => {
>     const {clientY} = event;
>     if(clientY <= 0) onBefore();
>   }
>   useEffect(() => {
>     if(!onBefore || typeof onBefore !== "function") return;
>     document.addEventListener("mouseleave", handle);
>     return () => document.removeEventListener("mouseleave", handle);
>   }, []);
> };
> ```

#### useFadeIn

> ```jsx
> const useFadeIn = (duration=1, delay=0) => {
>   const element = useRef();
>   useEffect(() => {
>     if(typeof duration !== "number" || typeof delay !== "number") return;
>     if(element.current) {
>       const {current} = element;
>       current.style.transition = `opacity ${duration}s ease-in-out ${delay}s`;
>       current.style.opacity = 1;
>     }
>   }, []);
>   return typeof duration === "number" && typeof delay === "number" ? {ref: element, style: {opacity: 0}} : undefined;
> };
> ```

#### useNetwork

> ```jsx
> const useNetwork = onChange => {
>   const [status, setStatus] = useState(navigator.online);
>   const handleChange = () => {
>     onChange(navigator.onLine)
>     setStatus(navigator.onLine);
>   }
>   useEffect(() => {
>     window.addEventListener("online", handleChange);
>     window.addEventListener("offline", handleChange);
>     return () => {
>       window.removeEventListener("online", handleChange);
>       window.removeEventListener("offline", handleChange);
>     };
>   }, [])
>   return status;
> };
> ```

#### useScroll

> ```jsx
> const useScroll = () => {
>   const [state, setState] = useState({
>     x: 0,
>     y: 0,
>   });
>   const onScroll = () => {
>     setState({x: window.scrollX, y: window.scrollY});
>   };
>   useEffect(() => {
>     window.addEventListener("scroll", onScroll);
>     return () => window.removeEventListener("scroll", onScroll);
>   }, []);
>   return state;
> };
> ```

#### useFullscreen

> ```jsx
> const useFullscreen = (callback) => {
>   const element = useRef();
>   const triggerFull = () => {
>     if(element.current) {
>       element.current.requestFullscreen();//브라우저마다 다름
>       if(callback && typeof callback === "function") {
>         callback(true);
>       }
>     }
>   };
>   const exitFull = () => {
>     document.exitFullscreen();
>     if(callback && typeof callback === "function") {
>       callback(false);
>     }
>   };
>   return {element, triggerFull, exitFull};
> };
> ```

#### useNotification

> ```jsx
> const useNotification = (title, options) => {
>   if(!("Notification" in window)) {
>     return;
>   }
>   const fireNotif = () => {
>     if(Notification.permission !== "granted") {
>       Notification.requestPermission().then(permission => {
>         if(permission === "granted") {
>           new Notification(title, options);
>         }else {
>           return;
>         }
>       })
>     } else {
>       new Notification(title, options);
>     }
>   };
>   return fireNotif;
> };
> ```

#### useAxios

> ```jsx
> import defaultAxios from "axios";
> import { useEffect, useState } from "react";
> 
> const useAxios = (opts, axiosInstance=defaultAxios) => {
>   const [state, setState] = useState({
>     loading: true,
>     error: null,
>     data: null,
>   });
>   const [trigger, setTrigger] = useState(0);
>   const refetch = () => {
>     setState({...state, loading: true,});
>     setTrigger(Date.now());
>   };
>   useEffect(() => {
>     if(!opts.url) return;
>     axiosInstance(opts).then(data => {
>       setState({
>         ...state,
>         loading: false,
>         data,
>       });
>     }).catch(error => {
>       setState({...state, loading: false, error});
>     });
>   }, [trigger]);
>   return {...state, refetch};
> };
> export default useAxios;
> ```

다른 강의들보다 우선순위가 많이 낮은 거 같다.

