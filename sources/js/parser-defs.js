// All the code below is manually translated from C++ to JS by shaman.sir,
// C++ code author is Ali Rantakari (http://hasseg.org/peg-markdown-highlight/)
// the C++ file used as source is located here: http://hasseg.org/gitweb?p=peg-markdown-highlight.git;a=blob;f=pmh_parser_head.c;h=51528032723b9fc0eed0e854abbe2847b9d127b4;hb=HEAD

// ELEMENTS TYPES ==============================================================

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
    switch (type) {
        case pmd_SEPARATOR:          return "SEPARATOR";
        case pmd_EXTRA_TEXT:         return "EXTRA_TEXT";
        case pmd_NO_TYPE:            return "NO_TYPE";
        case pmd_RAW_LIST:           return "RAW_LIST";
        case pmd_RAW:                return "RAW";

        case pmd_LINK:               return "LINK";
        case pmd_IMAGE:              return "IMAGE";
        case pmd_CODE:               return "CODE";
        case pmd_HTML:               return "HTML";
        case pmd_EMPH:               return "EMPH";
        case pmd_STRONG:             return "STRONG";
        case pmd_LIST_BULLET:        return "LIST_BULLET";
        case pmd_LIST_ENUMERATOR:    return "LIST_ENUMERATOR";
        case pmd_H1:                 return "H1";
        case pmd_H2:                 return "H2";
        case pmd_H3:                 return "H3";
        case pmd_H4:                 return "H4";
        case pmd_H5:                 return "H5";
        case pmd_H6:                 return "H6";
        case pmd_BLOCKQUOTE:         return "BLOCKQUOTE";
        case pmd_VERBATIM:           return "VERBATIM";
        case pmd_HTMLBLOCK:          return "HTMLBLOCK";
        case pmd_HRULE:              return "HRULE";
        case pmd_REFERENCE:          return "REFERENCE";
        case pmd_NOTE:               return "NOTE";
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

var TYPESTR = type_name; // alias

// EXTENSIONS ==================================================================

// PHP Markdown Extra extensions
var pmd_EXT_FOOTNOTES = 1;
var pmd_EXT_DEF_LISTS = 2; // + "\:"
var pmd_EXT_SMART_BLOCKLVL_HTML = 4;
var pmd_EXT_ABBREVIATIONS = 8;
var pmd_EXT_MARKDOWN_INSIDE_HTML = 16;
var pmd_EXT_HEADERS_LINKS = 32;
var pmd_EXT_CURLY_CODE = 64;
var pmd_EXT_ALT_TABLES = 128; // + "\|"
var pmd_EXT_NO_EMPHASIS_IN_QUOTES = 256;

// Other Extentions
var pmd_EXT_HASHBANG_CODE_LANG = 512;

var pmd_EXTENSIONS = pmd_EXT_FOOTNOTES
                /* | pmd_EXT_DEF_LISTS
                   | pmd_EXT_HASHBANG_CODE_LANG
                   | pmd_EXT_HEADERS_LINKS */;

function ext_name(ext) {
    switch (ext) {
        case pmd_EXT_FOOTNOTES:             return "EXT_FOOTNOTES";
        case pmd_EXT_DEF_LISTS:             return "EXT_DEF_LISTS";
        case pmd_EXT_SMART_BLOCKLVL_HTML:   return "EXT_SMART_BLOCKLVL_HTML";
        case pmd_EXT_ABBREVIATIONS:         return "EXT_ABBREVIATIONS";
        case pmd_EXT_MARKDOWN_INSIDE_HTML:  return "EXT_MARKDOWN_INSIDE_HTML";
        case pmd_EXT_HEADERS_LINKS:         return "EXT_HEADERS_LINKS";
        case pmd_EXT_CURLY_CODE:            return "EXT_CURLY_CODE";
        case pmd_EXT_ALT_TABLES:            return "EXT_ALT_TABLES";
        case pmd_EXT_NO_EMPHASIS_IN_QUOTES: return "EXT_NO_EMPH_IN_QUOTES";
        case pmd_EXT_HASHBANG_CODE_LANG:    return "EXT_HASHBANG_CODE_LANG";
        default:                            return "?";
    }
}

var EXTSTR = ext_name; // alias

// STATE =======================================================================

var g_state = {
    'cur': null, // current element
    'root': null, // elements linked list head
    'extensions': pmd_EXTENSIONS, // enabled extensions
    'elems': [], // elements, indexed by type
    'refs': null, // references linked list head
};

g_state.elems = new Array(pmd_NUM_TYPES);

// FUNCTIONS ===================================================================

function make_element(state, type, chunk) {
    return make_element_i(state, type, chunk.pos, chunk.end, chunk.match);
}

function make_element_i(state, type, pos, end, text) {
    console.log('make_element: ', TYPESTR(type), pos, end, text);
    var elem = { 'type'       : type,
                 'pos'        : pos || -1,
                 'end'        : end || -1,
                 'next'       : null,
                 'label'      : null,
                 'address'    : null,
                 'text'       : text || null, // pmd_EXTRA_TEXT
                 'children'   : null }; // pmh_RAW_LIST
}

function add(state, elem) {
    console.log('add: ', elem);

    if (state.root === null)
        state.root = elem || null;

    state.cur.next = elem;
    state.cur = elem;

    if (state.elems[elem.type] === null)
        state.elems[elem.type] = elem;
    else {
        var last = elem;
        while (last.next != null)
            last = last.next;
        last.next = state.elems[elem.type];
        state.elems[elem.type] = elem;
    }

};

function extension(state, extension) {
    console.log('extension: ', EXTSTR(ext), state.extensions & extension);
    return state.extensions & extension;
};

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

// ALIAS =======================================================================

function elem(x,c)        { return make_element(g_state,x,c) } // type and chunk
function elem_ct(x,c,t)    { return make_element_i(g_state,x,c.pos,c.end,t) } // type, chunk (pos,end) and text
function elem_pe(x,p,e)    { return make_element_i(g_state,x,p,e) } // type, pos, end (no text)
function elem_pet(x,p,e,t) { return make_element_i(g_state,x,p,e,t) } // type, pos, end, text
function elem_z(x)         { return make_element_i(g_state,x,0,0) } // type only
//function mk_sep()    { return make_element(g_state, pmd_SEPARATOR, 0,0) }
//function mk_notype() { return make_element(g_state, pmd_NO_TYPE, 0,0) }
function ADD(x)          { return add(g_state, x) }
function EXT(x)          { return extension(g_state, x) }
function REF_EXISTS(x)   { return (get_reference(g_state, x) != null); }
function GET_REF(x)      { return get_reference(g_state, x); }

