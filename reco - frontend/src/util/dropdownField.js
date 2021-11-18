import { useState, useRef, useEffect } from "react";

const DropdownField = (props) => {
    const label = props.label;
    const type = props.type;
    const entries = props.entries;
    const onMore = props.onMore;
    const hasMore = props.hasMore;
    const onSelect = props.onSelect;
    const value = props.value;
    const onInput = props.onInput;

    const [focused, setFocused] = useState(false);
    const inputElem = useRef();
    const ulElem = useRef();
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const selectedLi = useRef();

    function liProps(index) {
        if (index === selectedIndex) {
            return {ref: selectedLi};
        } else {
            return {};
        }
    }

    function keyDown(e) {
        if (e.key === "ArrowDown") {
            let totalCount = entries.length;
            if (hasMore) totalCount++;
            setSelectedIndex(Math.min(totalCount - 1, selectedIndex + 1));
        } else if (e.key === "ArrowUp") {
            setSelectedIndex(Math.max(0, selectedIndex - 1));
        } else if (e.key === "Escape") {
            inputElem.current.blur();
        } else if (e.key === "Enter") {
            if (selectedLi.current && selectedIndex < entries.length) {
                onSelect(entries[selectedIndex]);
                onInput("");
                inputElem.current.blur();
                setSelectedIndex(-1);
            } else if (selectedIndex === entries.length) {
                onMore();
            } else {
                inputElem.current.blur();
            }
        } 
    }

    function scrollToSelected() {
        if (!selectedLi.current) return;

        const selected = selectedLi.current;
        const ul = ulElem.current;

        const visibleTop = ul.scrollTop;
        const visibleBottom = visibleTop + ul.offsetHeight;

        const selectedTop = selected.offsetTop;
        const selectedBottom = selectedTop + selected.offsetHeight;

        if (selectedTop < visibleTop) {
            ul.scrollTo(0, selectedTop);
        }
        if (selectedBottom > visibleBottom) {
            const missingBy = selectedBottom - visibleBottom;
            ul.scrollTo(0, visibleTop + missingBy);
        }
    }
    useEffect(scrollToSelected, [selectedIndex]);

    function select(index) {
        onSelect(entries[index]);
        setSelectedIndex(-1);
        onInput("");
    }

    function moreSelected(e) {
        e.preventDefault();
        onMore();
    }

    return (
        <div>
            <label className="jam-form-label">{label}</label>
            <div className="jam-form-input-dropdown">
                <input 
                    type={type} 
                    value={value} 
                    onInput={e => onInput(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyDown={keyDown}
                    ref={inputElem}
                    />
                {focused ? <ul ref={ulElem}>
                    {entries.map((entry, index) => (
                        <li onMouseDown={e => select(index)} className={selectedIndex === index ? "selected" : ""} key={index} {...liProps(index)}>{entry.html}</li>
                    ))}
                    {hasMore 
                        ? <li 
                            onMouseDown={moreSelected} 
                            className={selectedIndex === entries.length ? "selected" : ""} 
                            {...liProps(entries.length)}
                            key={entries.length}
                        ><b>Show more...</b></li> 
                        : false}
                </ul> : <div></div>}
            </div>
        </div>
    );
}

export default DropdownField;