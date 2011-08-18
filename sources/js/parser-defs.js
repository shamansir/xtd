/// header_code_here

/* var G = {   char *buf;
  int buflen;
  int   offset;
  int   pos;
  int   limit;
  char *text;
  int   textlen;
  int   begin;
  int   end;
  yythunk *thunks;
  int   thunkslen;
  int thunkpos;
  YYSTYPE ss;
  YYSTYPE *val;
  YYSTYPE *vals;
  int valslen;
  YY_XTYPE data; }; */
// var thunk = { begin: 0, end: 0 };

/*
struct pmh_RealElement
{
    // "Public" members:
    // (these must match what's defined in pmh_definitions.h)
    // -----------------------------------------------
    pmh_element_type type;
    unsigned long pos;
    unsigned long end;
    struct pmh_RealElement *next;
    char *label;
    char *address;

    // "Private" members for use by the parser itself:
    // -----------------------------------------------

    // next element in list of all elements:
    struct pmh_RealElement *allElemsNext;

    // offset to text (for elements of type pmh_EXTRA_TEXT, used when the
    // parser reads the value of 'text'):
    int textOffset;

    // text content (for elements of type pmh_EXTRA_TEXT):
    char *text;

    // children of element (for elements of type pmh_RAW_LIST)
    struct pmh_RealElement *children;
};
typedef struct pmh_RealElement pmh_realelement;


// Parser state data:
typedef struct
{
    // Buffer of characters to be parsed:
    char *charbuf;

    // Linked list of {start, end} offset pairs determining which parts
    pmh_realelement *elem;
    pmh_realelement *elem_head;

    // Current parsing offset within charbuf:
    unsigned long offset;

    // The extensions to use for parsing (bitfield
    // of enum pmh_extensions):
    int extensions;

    /* Array of parsing result elements, indexed by type:
    //pmh_realelement **head_elems;

    // Whether we are parsing only references:
    //bool parsing_only_references;

    //  List of reference elements:
    pmh_realelement *references;
} parser_data; */

function mk_element(data, type, begin, end) {
    console.log('mk_element: ', data, type, begin, end);
};

function mk_etext(data, type) {
    console.log('mk_etext: ', data, type);
};

function add(data, type) {
    console.log('add: ', data, type);
};

function extension(data, type) {
    console.log('extension: ', data, type);
};

function reference_exists(data, type) {
    console.log('reference_exists: ', data, type);
};

function reference_exists(data, type) {
    console.log('reference_exists: ', data, type);
};

function get_reference(data, type) {
    console.log('get_reference: ', data, type);
}

function elem(x)     { return mk_element(G.data, x, thunk->begin, thunk->end) }
function elem_s(x)   { return mk_element(G.data, x, s->pos, thunk->end) }
function mk_sep()    { return mk_element(G.data, pmh_SEPARATOR, 0,0) }
function mk_notype() { return mk_element(G.data, pmh_NO_TYPE, 0,0) }
function etext(x)    { return mk_etext(G.data, x) }
function ADD(x)      { return add((parser_data *)G->data, x) }
function EXT(x)      { return extension((parser_data *)G->data, x) }
function REF_EXISTS(x)   { return reference_exists((parser_data *)G->data, x); }
function GET_REF(x)      { return get_reference(G.data, x) }
var PARSING_REFERENCES = G.data.parsing_only_references;
function FREE_LABEL(l)   { l.label = null; }
function FREE_ADDRESS(l) { l.address = null; }

var $$ = null;
var thunk = { begin: -1, end: -1 };

