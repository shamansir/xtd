// All the code below is manually translated from C++ to JS by shaman.sir,
// C++ code author is Ali Rantakari (http://hasseg.org/peg-markdown-highlight/)
// the C++ file used as source is located here: http://hasseg.org/gitweb?p=peg-markdown-highlight.git;a=blob;f=pmh_parser_head.c;h=51528032723b9fc0eed0e854abbe2847b9d127b4;hb=HEAD

// ELEMENTS TYPES ==============================================================

var t = new Object(null);

t.pmd_LINK            = 0;    /**< Explicit link */
t.pmd_AUTO_LINK_URL   = 1;    /**< Implicit URL link */
t.pmd_AUTO_LINK_EMAIL = 2;    /**< Implicit email link */
t.pmd_IMAGE           = 3;    /**< Image definition */
t.pmd_CODE            = 4;    /**< Code (inline) */
t.pmd_HTML            = 5;    /**< HTML */
t.pmd_HTML_ENTITY     = 6;    /**< HTML special entity definition */
t.pmd_EMPH            = 7;    /**< Emphasized text */
t.pmd_STRONG          = 8;    /**< Strong text */
t.pmd_LIST_BULLET     = 9;    /**< Bullet for an unordered list item */
t.pmd_LIST_ENUMERATOR = 10;   /**< Enumerator for an ordered list item */
t.pmd_COMMENT         = 11;   /**< (HTML) Comment */

// Code assumes that pmd_H1-6 are in order.
t.pmd_H1              = 12;   /**< Header, level 1 */
t.pmd_H2              = 13;   /**< Header, level 2 */
t.pmd_H3              = 14;   /**< Header, level 3 */
t.pmd_H4              = 15;   /**< Header, level 4 */
t.pmd_H5              = 16;   /**< Header, level 5 */
t.pmd_H6              = 17;   /**< Header, level 6 */

t.pmd_BLOCKQUOTE      = 18;   /**< Blockquote */
t.pmd_VERBATIM        = 19;   /**< Verbatim (e.g. block of code) */
t.pmd_HTMLBLOCK       = 20;   /**< Block of HTML */
t.pmd_HRULE           = 21;   /**< Horizontal rule */
t.pmd_REFERENCE       = 22;   /**< Reference */
t.pmd_NOTE            = 23;   /**< Note */

// Utility types used by the parser itself:

// List of pmd_RAW element lists, each to be processed separately from
// others (for each element in linked lists of this type, `children` points
// to a linked list of pmd_RAW elements):
t.pmd_RAW_LIST        = 24,   /**< Internal to parser. Please ignore. */

// Span marker for positions in original input to be post-processed
// in a second parsing step:
t.pmd_RAW             = 25,   /**< Internal to parser. Please ignore. */

// Additional text to be parsed along with spans in the original input
// (these may be added to linked lists of pmd_RAW elements):
t.pmd_EXTRA_TEXT      = 26,   /**< Internal to parser. Please ignore. */

// Separates linked lists of pmd_RAW elements into parts to be processed
// separate from each other:
t.pmd_SEPARATOR       = 27,   /**< Internal to parser. Please ignore. */

// Placeholder element used while parsing:
t.pmd_NO_TYPE         = 28,   /**< Internal to parser. Please ignore. */

// Linked list of *all* elements created while parsing:
t.pmd_ALL             = 29    /**< Internal to parser. Please ignore. */;

t.type_name = function(type) {
    switch (type) {
        case t.pmd_SEPARATOR:          return "SEPARATOR";
        case t.pmd_EXTRA_TEXT:         return "EXTRA_TEXT";
        case t.pmd_NO_TYPE:            return "NO_TYPE";
        case t.pmd_RAW_LIST:           return "RAW_LIST";
        case t.pmd_RAW:                return "RAW";

        case t.pmd_LINK:               return "LINK";
        case t.pmd_IMAGE:              return "IMAGE";
        case t.pmd_CODE:               return "CODE";
        case t.pmd_HTML:               return "HTML";
        case t.pmd_EMPH:               return "EMPH";
        case t.pmd_STRONG:             return "STRONG";
        case t.pmd_LIST_BULLET:        return "LIST_BULLET";
        case t.pmd_LIST_ENUMERATOR:    return "LIST_ENUMERATOR";
        case t.pmd_H1:                 return "H1";
        case t.pmd_H2:                 return "H2";
        case t.pmd_H3:                 return "H3";
        case t.pmd_H4:                 return "H4";
        case t.pmd_H5:                 return "H5";
        case t.pmd_H6:                 return "H6";
        case t.pmd_BLOCKQUOTE:         return "BLOCKQUOTE";
        case t.pmd_VERBATIM:           return "VERBATIM";
        case t.pmd_HTMLBLOCK:          return "HTMLBLOCK";
        case t.pmd_HRULE:              return "HRULE";
        case t.pmd_REFERENCE:          return "REFERENCE";
        case t.pmd_NOTE:               return "NOTE";
        default:                       return "?";
    }
}

/**
* \brief Number of types in pmd_element_type.
* \sa pmd_element_type
*/
t.pmd_NUM_TYPES = 30;

/**
* \brief Number of *language element* types in pmd_element_type.
* \sa pmd_element_type
*/
t.pmd_NUM_LANG_TYPES = (t.pmd_NUM_TYPES - 6);

// EXTENSIONS ==================================================================

var e = new Object(null);

// PHP Markdown Extra extensions
e.pmd_EXT_FOOTNOTES = 1;
e.pmd_EXT_DEF_LISTS = 2; // + "\:"
e.pmd_EXT_SMART_BLOCKLVL_HTML = 4;
e.pmd_EXT_ABBREVIATIONS = 8;
e.pmd_EXT_MARKDOWN_INSIDE_HTML = 16;
e.pmd_EXT_HEADERS_LINKS = 32;
e.pmd_EXT_CURLY_CODE = 64;
e.pmd_EXT_ALT_TABLES = 128; // + "\|"
e.pmd_EXT_NO_EMPHASIS_IN_QUOTES = 256;

// Other Extentions
e.pmd_EXT_HASHBANG_CODE_LANG = 512;

e.pmd_EXTENSIONS = e.pmd_EXT_FOOTNOTES
                /* | e.pmd_EXT_DEF_LISTS
                   | e.pmd_EXT_HASHBANG_CODE_LANG
                   | e.pmd_EXT_HEADERS_LINKS */;

e.ext_name = function(ext) {
    switch (ext) {
        case e.pmd_EXT_FOOTNOTES:             return "EXT_FOOTNOTES";
        case e.pmd_EXT_DEF_LISTS:             return "EXT_DEF_LISTS";
        case e.pmd_EXT_SMART_BLOCKLVL_HTML:   return "EXT_SMART_BLOCKLVL_HTML";
        case e.pmd_EXT_ABBREVIATIONS:         return "EXT_ABBREVIATIONS";
        case e.pmd_EXT_MARKDOWN_INSIDE_HTML:  return "EXT_MARKDOWN_INSIDE_HTML";
        case e.pmd_EXT_HEADERS_LINKS:         return "EXT_HEADERS_LINKS";
        case e.pmd_EXT_CURLY_CODE:            return "EXT_CURLY_CODE";
        case e.pmd_EXT_ALT_TABLES:            return "EXT_ALT_TABLES";
        case e.pmd_EXT_NO_EMPHASIS_IN_QUOTES: return "EXT_NO_EMPH_IN_QUOTES";
        case e.pmd_EXT_HASHBANG_CODE_LANG:    return "EXT_HASHBANG_CODE_LANG";
        default:                            return "?";
    }
}

// STATE =======================================================================

var g_state = {
    'cur': null, // current element
    'root': null, // elements linked list head
    'extensions': e.pmd_EXTENSIONS, // enabled extensions
    'elems': [], // elements, indexed by type
    'refs': null, // references linked list head
};

g_state.elems = new Array(t.pmd_NUM_TYPES);

g_state.toString = function() {
    var result = '\n\n' + 'cur ' + this.cur;

    result += '\n\n' + '// chain ';

    map_elems(this.root, function(elem) {
       result += elem.toString() + ' -> ';
    });

    result += '\n\n' + '// refs ';

    map_elems(this.refs, function(elem) {
       result += elem.toString() + ' -> ';
    });

    result += '\n\n' + '// elems ';

    for (var i = 0; i < t.pmd_NUM_TYPES; i++) {
        var elems = this.elems[i];
        if (elems != null) {
            result += '\n\n' + t.type_name(i) + ' ';
            for (var j = 0; j < elems.length; j++) {
                result += elems[j].toString() + ' ## ';
            };
        }
    }

    return result;
}

// FUNCTIONS ===================================================================

function map_elems(first, func) {
    if (first != null) {
        var cursor = first;
        while (cursor != null) {
            if (func) func(cursor);
            cursor = cursor.next;
        }
    }
}

function elem_info(elm) {
    return '{' + t.type_name(elm.type) + ' ' +
           elm.pos + ':' + elm.end + ((elm.text != null) ? (' ~( ' + elm.text + ' )~ ') : ' no-text') +
           ((elm.children != null) ? ' has-children' : '') +
           ((elm.data != null) ? (' @@ ' + elm.data) : '') + '}';
}

function _elem_info() { return elem_info(this); }

function make_element_i(state, type, pos, end, text) {
    console.log('make_element: ', t.type_name(type), pos, end, text);
    return { 'type'       : type,
             'pos'        : pos || -1, // -1 means 0 also
             'end'        : end || -1, // -1 means 0 also
             'next'       : null,
             'label'      : null,
             'address'    : null,
             'text'       : text || null, // pmd_EXTRA_TEXT
             'children'   : null, // pmh_RAW_LIST
             'data'       : null,
             'toString'   : _elem_info };
}

function make_element(state, type, chunk) {
    return make_element_i(state, type, chunk.pos, chunk.end, chunk.match);
}

function add_element(state, elem, data) {
    console.log('add: ', elem);

    if (state.root == null)
        state.root = elem || null;

    if (state.cur != null) {
        state.cur.next = elem;
    }

    state.cur = elem;

    if (state.elems[elem.type] == null)
        state.elems[elem.type] = [];
    state.elems[elem.type].push(elem);

    elem.data = data;

};

function extension(state, extension) {
    //console.log('extension: ', e.ext_name(extension), state.extensions & extension);
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

/* function cons(elem, list) {
    if (elem === null) throw new Error("Elem for cons func is null");

    cur = elem;
    while (cur.next !== null) {
        cur = cur.next;
    }
    cur.next = list;

    return elem;
} */

// ALIAS =======================================================================

function elem(x,c)         { return make_element(g_state,x,c) } // type and chunk
function elem_c(x,c)       { return make_element_i(g_state,x,c.pos,c.end) } // type, chunk (pos,end)
function elem_ct(x,c,t)    { return make_element_i(g_state,x,c.pos,c.end,t) } // type, chunk (pos,end) and text
function elem_pe(x,p,e)    { return make_element_i(g_state,x,p,e) } // type, pos, end (no text)
function elem_pet(x,p,e,t) { return make_element_i(g_state,x,p,e,t) } // type, pos, end, text
function elem_z(x)         { return make_element_i(g_state,x,0,0) } // type only
function add(x,d)          { return add_element(g_state,x,d) } // x is element, d (data) is optional
function ext(x)            { return extension(g_state,x) }
function ref_exists(x)     { return (get_reference(g_state,x) != null) }
function get_ref(x)        { return get_reference(g_state,x) }

// EXPORT ======================================================================

module.exports = {
    'elem': elem,
    'elem_c': elem_c,
    'elem_ct': elem_ct,
    'elem_pe': elem_pe,
    'elem_pet': elem_pet,
    'elem_z': elem_z,
    'add': add,
    'ext': ext,
    'ref_exists': ref_exists,
    'get_ref': get_ref,
    'state': g_state,
    'types': t,
    'exts': e,
    'TYPESTR': t.type_name,
    'EXTSTR': e.ext_name };

