// All the code below is manually translated from C++ to JS by shaman.sir,
// C++ code author is Ali Rantakari (http://hasseg.org/peg-markdown-highlight/)
// the C++ file used as source is located here: http://hasseg.org/gitweb?p=peg-markdown-highlight.git;a=blob;f=pmh_parser_head.c;h=51528032723b9fc0eed0e854abbe2847b9d127b4;hb=HEAD

var pmd_LINK            = 0,    /**< Explicit link */
    pmd_AUTO_LINK_URL   = 1,    /**< Implicit URL link */
    pmd_AUTO_LINK_EMAIL = 2,    /**< Implicit email link */
    pmd_IMAGE           = 3,    /**< Image definition */
    pmd_CODE            = 4,    /**< Code (inline) */
    pmd_HTML            = 5,    /**< HTML */
    pmd_HTML_ENTITY     = 6,    /**< HTML special entity definition */
    pmd_EMPH            = 7,    /**< Emphasized text */
    pmd_STRONG          = 8,    /**< Strong text */
    pmd_LIST_BULLET     = 9,    /**< Bullet for an unordered list item */
    pmd_LIST_ENUMERATOR = 10,   /**< Enumerator for an ordered list item */
    pmd_COMMENT         = 11,   /**< (HTML) Comment */

    // Code assumes that pmd_H1-6 are in order.
    pmd_H1              = 12,   /**< Header, level 1 */
    pmd_H2              = 13,   /**< Header, level 2 */
    pmd_H3              = 14,   /**< Header, level 3 */
    pmd_H4              = 15,   /**< Header, level 4 */
    pmd_H5              = 16,   /**< Header, level 5 */
    pmd_H6              = 17,   /**< Header, level 6 */

    pmd_BLOCKQUOTE      = 18,   /**< Blockquote */
    pmd_VERBATIM        = 19,   /**< Verbatim (e.g. block of code) */
    pmd_HTMLBLOCK       = 20,   /**< Block of HTML */
    pmd_HRULE           = 21,   /**< Horizontal rule */
    pmd_REFERENCE       = 22,   /**< Reference */
    pmd_NOTE            = 23,   /**< Note */

    // Utility types used by the parser itself:

    // List of pmd_RAW element lists, each to be processed separately from
    // others (for each element in linked lists of this type, `children` points
    // to a linked list of pmd_RAW elements):
    pmd_RAW_LIST        = 24,   /**< Internal to parser. Please ignore. */

    // Span marker for positions in original input to be post-processed
    // in a second parsing step:
    pmd_RAW             = 25,   /**< Internal to parser. Please ignore. */

    // Additional text to be parsed along with spans in the original input
    // (these may be added to linked lists of pmd_RAW elements):
    pmd_EXTRA_TEXT      = 26,   /**< Internal to parser. Please ignore. */

    // Separates linked lists of pmd_RAW elements into parts to be processed
    // separate from each other:
    pmd_SEPARATOR       = 27,   /**< Internal to parser. Please ignore. */

    // Placeholder element used while parsing:
    pmd_NO_TYPE         = 28,   /**< Internal to parser. Please ignore. */

    // Linked list of *all* elements created while parsing:
    pmd_ALL             = 29    /**< Internal to parser. Please ignore. */;

function type_name(type) {
    switch (type)
    {
        case pmd_SEPARATOR:          return "SEPARATOR"; break;
        case pmd_EXTRA_TEXT:         return "EXTRA_TEXT"; break;
        case pmd_NO_TYPE:            return "NO TYPE"; break;
        case pmd_RAW_LIST:           return "RAW_LIST"; break;
        case pmd_RAW:                return "RAW"; break;

        case pmd_LINK:               return "LINK"; break;
        case pmd_IMAGE:              return "IMAGE"; break;
        case pmd_CODE:               return "CODE"; break;
        case pmd_HTML:               return "HTML"; break;
        case pmd_EMPH:               return "EMPH"; break;
        case pmd_STRONG:             return "STRONG"; break;
        case pmd_LIST_BULLET:        return "LIST_BULLET"; break;
        case pmd_LIST_ENUMERATOR:    return "LIST_ENUMERATOR"; break;
        case pmd_H1:                 return "H1"; break;
        case pmd_H2:                 return "H2"; break;
        case pmd_H3:                 return "H3"; break;
        case pmd_H4:                 return "H4"; break;
        case pmd_H5:                 return "H5"; break;
        case pmd_H6:                 return "H6"; break;
        case pmd_BLOCKQUOTE:         return "BLOCKQUOTE"; break;
        case pmd_VERBATIM:           return "VERBATIM"; break;
        case pmd_HTMLBLOCK:          return "HTMLBLOCK"; break;
        case pmd_HRULE:              return "HRULE"; break;
        case pmd_REFERENCE:          return "REFERENCE"; break;
        case pmd_NOTE:               return "NOTE"; break;
        default:                 return "?";
    }
}

/**
* \brief Number of types in pmd_element_type.
* \sa pmd_element_type
*/
var pmd_NUM_TYPES = 30;

/**
* \brief Number of *language element* types in pmd_element_type.
* \sa pmd_element_type
*/
var pmd_NUM_LANG_TYPES = (pmd_NUM_TYPES - 6);

var pmd_EXT_NOTES = 1;
var pmd_EXT_DEFLISTS = 2;

var pmd_EXTENTIONS = 0;

var TYPESTR = type_name; // alias

var g_state = {
    'text': '', // text buffer
    'cur': null, // current element
    'root': null, // elements linked list head
    'offset': -1, // current offset in buffer
    'extentions': pmd_EXTENTIONS, // enabled extentions
    'elems': [], // elements, indexed by type
    'parse_only_refs': false, // parse only references
    'refs': null }; // references linked list head

g_state.tree = new Array(pmd_NUM_TYPES);

// remove_zero_length_raw_spans(elem)
// print_raw_spans_inline(elem)
// process_raw_blocks(state)
// pmh_markdown_to_elements(text, entensions)
// pmh_sort_elements_by_pos(elems)
// cons(elem, list)
// reverse(list)
// fix_offsets(state, elem)

function fix_offsets(state, elem) {
    return elem;
}

function make_element(state, type, pos, end) {
    console.log('make_element: ', TYPESTR(type), pos, end);
    var elem = { 'type'       : type,
                 'pos'        : pos || -1,
                 'end'        : end || -1,
                 'next'       : null,
                 'label'      : null,
                 'address'    : null,
                 // private
                 'textOffset' : -1, // pmd_EXTRA_TEXT
                 'text'       : null, // pmd_EXTRA_TEXT
                 'global_next': null,
                 'children'   : null }; // pmh_RAW_LIST
    var prev_all_head = state.elems[pmd_ALL];
    state.elems[pmd_ALL] = elem;
    elem.global_next = prev_all_head;
}


// copy_element(state, elem)

function make_extra_text(state, content) {
    if (content == null) console.warn('content is null');
    var elem = make_element(state, pmd_EXTRA_TEXT, 0, 0);
    elem.text = content;
    return elem;
}

function add(state, elem) {
    console.log('add: ', elem);

    if (elem.type != pmd_RAW_LIST) {
        elem = fix_offsets(state, elem);
    } else {
        var cursor = elem.children;
        var prev = null;
        while (cursor != null) {
            next = cursor.next;
            var new_cursor = fix_offsets(state, cursor);
            if (prev != null)
                prev.next = new_cursor;
            else
                elem.children = new_cursor;
            /*while (new_cursor.next != null) {
                new_cursor = new_cursor.next;
            }*/
            if (next != null)
                new_cursor.next = next;
            prev = new_cursor;
            cursor = next;
        }
    }

    if (state.elems[elem.type] == null)
        state.elems[elem.type] = elem;
    else {
        var last = elem;
        while (last.next != null)
            last = last.next;
        last.next = state.elems[elem.type];
        state.elems[elem.type] = elem;
    }

};

function add_element(state, type, pos, end) {
    var new_element = make_element(state, type, pos, end);
    add(state, new_element);
    return new_element;
}

function add_raw(state, pos, end) {
    return add_element(state, pmd_RAW, pos, end);
}

function extension(state, extention) {
    console.log('extension: ', TYPESTR(type), state.extensions & extension);
    return state.extensions & extension;
};

/* function reference_exists(data, label) {
    console.log('reference_exists: ', label);
    return (get_reference)
}; */

function get_reference(state, label) {
    console.log('get_reference: ', label);
    if (!label) return;
    var cursor = state.refs;
    while (cursor != null) {
       if (cursor.label && (cursor.label == label)) {
           return cursor;
       }
       cursor = cursor.next;
    }
}

// aliases
function elem(x)     { return make_element(g_state, x, pos, end) }
function elem_s(x)   { return make_element(g_state, x, s.pos, end) }
function mk_sep()    { return make_element(g_state, pmd_SEPARATOR, 0,0) }
function mk_notype() { return make_element(g_state, pmd_NO_TYPE, 0,0) }
function etext(x)    { return make_extra_text(g_state, x) }
function ADD(x)      { return add(g_state, x) }
function EXT(x)      { return extention(g_state, x) }
function REF_EXISTS(x)   { return (get_reference(g_state, x) != null); }
function GET_REF(x)      { return get_reference(g_state, x); }
var PARSING_REFERENCES = g_state.parsing_only_refs;

