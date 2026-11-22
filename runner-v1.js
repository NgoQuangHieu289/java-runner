/*! java-runner v1 - javac 21 + TeaVM chạy trong trình duyệt, dùng cho các bài học Java trong chat */
(function () {
const CORE = function () {
const SCANNER_SRC = String.raw`
public class Scanner implements AutoCloseable {
    private final String s;
    private int p = 0;
    public Scanner(java.io.InputStream in) { this.s = __In.DATA; }
    public Scanner(String src) { this.s = src; }
    private void skipWs() { while (p < s.length() && Character.isWhitespace(s.charAt(p))) p++; }
    private String peekToken() {
        int q = p;
        while (q < s.length() && Character.isWhitespace(s.charAt(q))) q++;
        int st = q;
        while (q < s.length() && !Character.isWhitespace(s.charAt(q))) q++;
        return st == q ? null : s.substring(st, q);
    }
    private RuntimeException noInput() {
        if (__In.INTERACTIVE) throw new __NeedInput();
        return new java.util.NoSuchElementException("Hết dữ liệu đầu vào — hãy nhập thêm vào ô Input");
    }
    public boolean hasNext() { return peekToken() != null; }
    public boolean hasNextLine() { return p < s.length(); }
    public boolean hasNextInt() { String t = peekToken(); if (t == null) return false; try { Integer.parseInt(t); return true; } catch (NumberFormatException e) { return false; } }
    public boolean hasNextDouble() { String t = peekToken(); if (t == null) return false; try { Double.parseDouble(t); return true; } catch (NumberFormatException e) { return false; } }
    public String next() {
        skipWs();
        if (p >= s.length()) throw noInput();
        int st = p;
        while (p < s.length() && !Character.isWhitespace(s.charAt(p))) p++;
        String t = s.substring(st, p);
        __In.echo(t);
        return t;
    }
    public int nextInt() { String t = next(); try { return Integer.parseInt(t); } catch (NumberFormatException e) { throw new InputMismatchException("\"" + t + "\" không phải số nguyên"); } }
    public long nextLong() { return Long.parseLong(next()); }
    public double nextDouble() { String t = next(); try { return Double.parseDouble(t); } catch (NumberFormatException e) { throw new InputMismatchException("\"" + t + "\" không phải số thực"); } }
    public float nextFloat() { return Float.parseFloat(next()); }
    public boolean nextBoolean() { return Boolean.parseBoolean(next()); }
    public String nextLine() {
        if (p >= s.length()) throw noInput();
        int e = s.indexOf('\n', p);
        String line;
        if (e < 0) { line = s.substring(p); p = s.length(); } else { line = s.substring(p, e); p = e + 1; }
        if (line.endsWith("\r")) line = line.substring(0, line.length() - 1);
        __In.echo(line);
        return line;
    }
    public void close() {}
}
`;

const NEED_SRC = String.raw`
public class __NeedInput extends Error {
    public __NeedInput() { super("need input"); }
}
`;

const IME_SRC = String.raw`
public class InputMismatchException extends java.util.NoSuchElementException {
    private final String msg;
    public InputMismatchException(String m) { super(m); this.msg = m; }
    public InputMismatchException() { this(null); }
    @Override public String toString() { return "java.util.InputMismatchException" + (msg == null ? "" : ": " + msg); }
}
`;

const FMT_SRC = String.raw`
public class __J {
    public static void printf(String f, Object... a) { System.out.print(format(f, a)); }
    public static void printf(java.util.Locale l, String f, Object... a) { System.out.print(format(f, a)); }
    public static void eprintf(String f, Object... a) { System.err.print(format(f, a)); }
    public static String format(java.util.Locale l, String f, Object... a) { return format(f, a); }
    public static String msg(Throwable t) {
        if (t == null) throw new NullPointerException();
        String s = t.toString();
        int k = s.indexOf(": ");
        return k < 0 ? null : s.substring(k + 2);
    }
    public static <T> T nn(T x, String m) { if (x == null) throw new NullPointerException(m); return x; }
    public static int div(int a, int b) { if (b == 0) throw new ArithmeticException("/ by zero"); return a / b; }
    public static long div(long a, long b) { if (b == 0L) throw new ArithmeticException("/ by zero"); return a / b; }
    public static float div(float a, float b) { return a / b; }
    public static double div(double a, double b) { return a / b; }
    public static int mod(int a, int b) { if (b == 0) throw new ArithmeticException("/ by zero"); return a % b; }
    public static long mod(long a, long b) { if (b == 0L) throw new ArithmeticException("/ by zero"); return a % b; }
    public static float mod(float a, float b) { return a % b; }
    public static double mod(double a, double b) { return a % b; }
    public static int I;
    private static void ck(int len, int i) { if (i < 0 || i >= len) throw new ArrayIndexOutOfBoundsException("Index " + i + " out of bounds for length " + len); I = i; }
    private static NullPointerException an(String t, String n, boolean st) { return new NullPointerException((st ? "Cannot store to " : "Cannot load from ") + t + " array because \"" + n + "\" is null"); }
    public static int[] A(int[] a, int i, String n, boolean st) { if (a == null) throw an("int", n, st); ck(a.length, i); return a; }
    public static long[] A(long[] a, int i, String n, boolean st) { if (a == null) throw an("long", n, st); ck(a.length, i); return a; }
    public static double[] A(double[] a, int i, String n, boolean st) { if (a == null) throw an("double", n, st); ck(a.length, i); return a; }
    public static float[] A(float[] a, int i, String n, boolean st) { if (a == null) throw an("float", n, st); ck(a.length, i); return a; }
    public static char[] A(char[] a, int i, String n, boolean st) { if (a == null) throw an("char", n, st); ck(a.length, i); return a; }
    public static byte[] A(byte[] a, int i, String n, boolean st) { if (a == null) throw an("byte/boolean", n, st); ck(a.length, i); return a; }
    public static boolean[] A(boolean[] a, int i, String n, boolean st) { if (a == null) throw an("byte/boolean", n, st); ck(a.length, i); return a; }
    public static short[] A(short[] a, int i, String n, boolean st) { if (a == null) throw an("short", n, st); ck(a.length, i); return a; }
    public static <T> T[] A(T[] a, int i, String n, boolean st) { if (a == null) throw an("object", n, st); ck(a.length, i); return a; }
    public static String format(String f, Object... a) {
        StringBuilder sb = new StringBuilder();
        int ai = 0, i = 0, n = f.length();
        while (i < n) {
            char ch = f.charAt(i);
            if (ch != '%') { sb.append(ch); i++; continue; }
            int st = i++;
            String flags = "";
            while (i < n && "-#+ 0,(".indexOf(f.charAt(i)) >= 0) flags += f.charAt(i++);
            int w = -1;
            int ws = i;
            while (i < n && Character.isDigit(f.charAt(i))) i++;
            if (i > ws) w = Integer.parseInt(f.substring(ws, i));
            int prec = -1;
            if (i < n && f.charAt(i) == '.') { i++; int ps = i; while (i < n && Character.isDigit(f.charAt(i))) i++; prec = Integer.parseInt(f.substring(ps, i)); }
            if (i >= n) throw new RuntimeException("java.util.UnknownFormatConversionException: '" + f.substring(st) + "'");
            char conv = f.charAt(i++);
            if (conv == 'n') { sb.append('\n'); continue; }
            if (conv == '%') { sb.append(pad("%", w, flags)); continue; }
            if (ai >= a.length) throw new RuntimeException("java.util.MissingFormatArgumentException: Format specifier '" + f.substring(st, i) + "'");
            Object v = a[ai++];
            char lc = Character.toLowerCase(conv);
            String out;
            if ((lc == 'f' || lc == 'e') && v instanceof Number) {
                double d = ((Number) v).doubleValue();
                int pr = prec < 0 ? 6 : prec;
                out = lc == 'f' ? fixed(d, pr, flags.indexOf(',') >= 0) : sci(d, pr);
                if (d >= 0 && flags.indexOf('+') >= 0) out = "+" + out;
                else if (d >= 0 && flags.indexOf(' ') >= 0) out = " " + out;
                if (Character.isUpperCase(conv)) out = out.toUpperCase();
                out = pad(out, w, flags);
            } else {
                out = String.format(f.substring(st, i), v);
            }
            sb.append(out);
        }
        return sb.toString();
    }
    private static String fixed(double d, int pr, boolean group) {
        if (Double.isNaN(d)) return "NaN";
        if (Double.isInfinite(d)) return d > 0 ? "Infinity" : "-Infinity";
        String s = java.math.BigDecimal.valueOf(d).setScale(pr, java.math.RoundingMode.HALF_UP).toPlainString();
        if (!group) return s;
        boolean neg = s.startsWith("-");
        if (neg) s = s.substring(1);
        int dot = s.indexOf('.');
        String ip = dot < 0 ? s : s.substring(0, dot), fp = dot < 0 ? "" : s.substring(dot);
        StringBuilder g = new StringBuilder();
        for (int k = 0; k < ip.length(); k++) { if (k > 0 && (ip.length() - k) % 3 == 0) g.append(','); g.append(ip.charAt(k)); }
        return (neg ? "-" : "") + g + fp;
    }
    private static String sci(double d, int pr) {
        if (d == 0) { String z = fixed(0, pr, false); return z + "e+00"; }
        int ex = (int) Math.floor(Math.log10(Math.abs(d)));
        double m = d / Math.pow(10, ex);
        String ms = fixed(m, pr, false);
        if (ms.replace("-", "").startsWith("10")) { ex++; ms = fixed(d / Math.pow(10, ex), pr, false); }
        String es = String.valueOf(Math.abs(ex));
        if (es.length() < 2) es = "0" + es;
        return ms + "e" + (ex < 0 ? "-" : "+") + es;
    }
    private static String pad(String s, int w, String flags) {
        if (w <= s.length()) return s;
        StringBuilder b = new StringBuilder();
        int k = w - s.length();
        if (flags.indexOf('-') >= 0) { b.append(s); while (k-- > 0) b.append(' '); return b.toString(); }
        if (flags.indexOf('0') >= 0) {
            int sign = (s.startsWith("-") || s.startsWith("+")) ? 1 : 0;
            b.append(s, 0, sign); while (k-- > 0) b.append('0'); b.append(s.substring(sign)); return b.toString();
        }
        while (k-- > 0) b.append(' ');
        return b.append(s).toString();
    }
}
`;

function javaStr(s) {
  let r = '"';
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (ch === '\\') r += '\\\\';
    else if (ch === '"') r += '\\"';
    else if (ch === '\n') r += '\\n';
    else if (ch === '\r') r += '\\r';
    else if (ch === '\t') r += '\\t';
    else if (c < 32 || c > 126) {
      if (c > 0xffff) { const s2 = String.fromCodePoint(c); for (let k = 0; k < 2; k++) r += '\\u' + s2.charCodeAt(k).toString(16).padStart(4, '0'); }
      else r += '\\u' + c.toString(16).padStart(4, '0');
    } else r += ch;
  }
  return r + '"';
}

function inSrc(data, echo, interactive) {
  return 'public class __In {\n    static final boolean INTERACTIVE = ' + (interactive ? 'true' : 'false') + ';\n    static final String DATA = ' + javaStr(data) + ';\n' +
    '    static void echo(String t) { ' + (echo ? 'System.out.print("\\uE000" + t + "\\uE001");' : '') + ' }\n}\n';
}
function rewrite(code, fmt) {
  const notes = [];
  let out = '', i = 0;
  const n = code.length;
  const reps = [
    [/^System\s*\.\s*out\s*\.\s*(printf|format)\s*\(/, '__J.printf('],
    [/^System\s*\.\s*err\s*\.\s*(printf|format)\s*\(/, '__J.eprintf('],
    [/^String\s*\.\s*format\s*\(/, '__J.format('],
    [/^java\s*\.\s*util\s*\.\s*Scanner\b/, 'Scanner'],
    [/^java\s*\.\s*util\s*\.\s*InputMismatchException\b/, 'InputMismatchException'],
  ];
  while (i < n) {
    const c = code[i];
    if (c === '/' && code[i + 1] === '/') { const e = code.indexOf('\n', i); const j = e < 0 ? n : e; out += code.slice(i, j); i = j; continue; }
    if (c === '/' && code[i + 1] === '*') { const e = code.indexOf('*/', i + 2); const j = e < 0 ? n : e + 2; out += code.slice(i, j); i = j; continue; }
    if (c === '"' && code.startsWith('"""', i)) { const e = code.indexOf('"""', i + 3); const j = e < 0 ? n : e + 3; out += code.slice(i, j); i = j; continue; }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && code[j] !== c && code[j] !== '\n') { if (code[j] === '\\') j++; j++; }
      out += code.slice(i, j + 1); i = j + 1; continue;
    }
    const prev = out.length ? out[out.length - 1] : ' ';
    if (!/[\w$.]/.test(prev)) {
      const rest = code.slice(i, i + 60);
      let hit = false;
      for (const [re, rep] of reps) {
        if (!fmt && rep.startsWith('__J')) continue;
        const m = rest.match(re);
        if (m) { out += rep; i += m[0].length; hit = true; break; }
      }
      if (hit) continue;
      const sw = code.slice(i, i + 400).match(/^@\s*(?:java\s*\.\s*lang\s*\.\s*)?SuppressWarnings\b\s*(?:\([^)]*\))?/);
      if (sw) { out += sw[0].replace(/[^\n]/g, ' '); i += sw[0].length; continue; }
      const imp = code.slice(i).match(/^import\s+java\s*\.\s*util\s*\.\s*(Scanner|InputMismatchException)\s*;/);
      if (imp) { out += '/* ' + imp[0] + ' */'; i += imp[0].length; continue; }
      const pkg = code.slice(i).match(/^package\s+[\w.]+\s*;/);
      if (pkg && out.trim() === '') { out += '/* ' + pkg[0] + ' */'; i += pkg[0].length; notes.push('package'); continue; }
    }
    out += c; i++;
  }
  return { code: out, notes };
}

function fixGetMessage(code) {
  return code.replace(/\b([A-Za-z_$][\w$]*)\s*\.\s*get(?:Localized)?Message\s*\(\s*\)/g, '__J.msg($1)');
}

function runnerSrc(mainClass) {
  return 'public class __Run {\n  public static void main(String[] a) {\n    try { ' + mainClass +
    '.main(new String[0]); }\n    catch (__NeedInput n) { System.out.print("\\uE002"); }\n    catch (Throwable t) { System.out.flush(); System.err.println("Exception in thread \\"main\\" " + t); }\n  }\n}\n';
}

const HM_SRC = String.raw`
public class __HashMap<K, V> extends java.util.AbstractMap<K, V> implements java.util.Map<K, V> {
    static final int MAXC = 1 << 30;
    static final class Node<K, V> implements java.util.Map$Entry<K, V> {
        final int hash; final K key; V value; Node<K, V> next;
        Node(int h, K k, V v, Node<K, V> n) { hash = h; key = k; value = v; next = n; }
        public K getKey() { return key; }
        public V getValue() { return value; }
        public V setValue(V v) { V o = value; value = v; return o; }
        public String toString() { return key + "=" + value; }
        public int hashCode() { return java.util.Objects.hashCode(key) ^ java.util.Objects.hashCode(value); }
        public boolean equals(Object o) {
            if (o == this) return true;
            if (!(o instanceof java.util.Map$Entry)) return false;
            java.util.Map$Entry<?, ?> e = (java.util.Map$Entry<?, ?>) o;
            return java.util.Objects.equals(key, e.getKey()) && java.util.Objects.equals(value, e.getValue());
        }
    }
    Node<K, V>[] table;
    int size, threshold, modCount;
    final float loadFactor;

    static int hash(Object k) { int h; return k == null ? 0 : (h = k.hashCode()) ^ (h >>> 16); }
    static int tableSizeFor(int cap) { int n = -1 >>> Integer.numberOfLeadingZeros(cap - 1); return n < 0 ? 1 : (n >= MAXC ? MAXC : n + 1); }
    static int capFor(int n) { return (int) Math.ceil(n / 0.75); }

    public __HashMap() { loadFactor = 0.75f; }
    public __HashMap(int ic) { this(ic, 0.75f); }
    public __HashMap(int ic, float lf) {
        if (ic < 0) throw new IllegalArgumentException("Illegal initial capacity: " + ic);
        if (ic > MAXC) ic = MAXC;
        if (lf <= 0 || Float.isNaN(lf)) throw new IllegalArgumentException("Illegal load factor: " + lf);
        loadFactor = lf;
        threshold = tableSizeFor(ic);
    }
    public __HashMap(java.util.Map<? extends K, ? extends V> m) { loadFactor = 0.75f; putMapEntries(m); }
    public static <K, V> __HashMap<K, V> newHashMap(int n) { return new __HashMap<>(capFor(n)); }

    void putMapEntries(java.util.Map<? extends K, ? extends V> m) {
        int s = m.size();
        if (s > 0) {
            if (table == null) {
                double dt = Math.ceil(s / (double) loadFactor);
                int t = (dt < (double) MAXC) ? (int) dt : MAXC;
                if (t > threshold) threshold = tableSizeFor(t);
            } else {
                while (s > threshold && table.length < MAXC) resize();
            }
            for (java.util.Map$Entry<? extends K, ? extends V> e : m.entrySet()) { K k = e.getKey(); putVal(hash(k), k, e.getValue(), false); }
        }
    }

    final Node<K, V>[] resize() {
        Node<K, V>[] oldTab = table;
        int oldCap = oldTab == null ? 0 : oldTab.length, oldThr = threshold, newCap, newThr = 0;
        if (oldCap > 0) {
            if (oldCap >= MAXC) { threshold = Integer.MAX_VALUE; return oldTab; }
            else if ((newCap = oldCap << 1) < MAXC && oldCap >= 16) newThr = oldThr << 1;
        } else if (oldThr > 0) newCap = oldThr;
        else { newCap = 16; newThr = 12; }
        if (newThr == 0) { float ft = (float) newCap * loadFactor; newThr = (newCap < MAXC && ft < (float) MAXC ? (int) ft : Integer.MAX_VALUE); }
        threshold = newThr;
        Node<K, V>[] newTab = (Node<K, V>[]) new Node[newCap];
        table = newTab;
        if (oldTab != null) {
            for (int j = 0; j < oldCap; ++j) {
                Node<K, V> e = oldTab[j];
                if (e == null) continue;
                oldTab[j] = null;
                if (e.next == null) { newTab[e.hash & (newCap - 1)] = e; continue; }
                Node<K, V> loH = null, loT = null, hiH = null, hiT = null, next;
                do {
                    next = e.next;
                    if ((e.hash & oldCap) == 0) { if (loT == null) loH = e; else loT.next = e; loT = e; }
                    else { if (hiT == null) hiH = e; else hiT.next = e; hiT = e; }
                } while ((e = next) != null);
                if (loT != null) { loT.next = null; newTab[j] = loH; }
                if (hiT != null) { hiT.next = null; newTab[j + oldCap] = hiH; }
            }
        }
        return newTab;
    }

    final V putVal(int hash, K key, V value, boolean onlyIfAbsent) {
        Node<K, V>[] tab = table; int n, i;
        if (tab == null || (n = tab.length) == 0) n = (tab = resize()).length;
        Node<K, V> p = tab[i = (n - 1) & hash];
        if (p == null) tab[i] = new Node<>(hash, key, value, null);
        else {
            Node<K, V> e = null;
            for (int binCount = 0; ; ++binCount) {
                if (p.hash == hash && java.util.Objects.equals(p.key, key)) { e = p; break; }
                if (p.next == null) {
                    p.next = new Node<>(hash, key, value, null);
                    if (binCount >= 7 && tab.length < 64) resize();
                    break;
                }
                p = p.next;
            }
            if (e != null) { V old = e.value; if (!onlyIfAbsent || old == null) e.value = value; return old; }
        }
        ++modCount;
        if (++size > threshold) resize();
        return null;
    }

    final Node<K, V> getNode(Object key) {
        Node<K, V>[] tab = table;
        if (tab == null || tab.length == 0) return null;
        int h = hash(key);
        for (Node<K, V> e = tab[(tab.length - 1) & h]; e != null; e = e.next) if (e.hash == h && java.util.Objects.equals(e.key, key)) return e;
        return null;
    }

    final Node<K, V> removeNode(Object key) {
        Node<K, V>[] tab = table;
        if (tab == null || tab.length == 0) return null;
        int h = hash(key), idx = (tab.length - 1) & h;
        Node<K, V> prev = null;
        for (Node<K, V> e = tab[idx]; e != null; prev = e, e = e.next) {
            if (e.hash == h && java.util.Objects.equals(e.key, key)) {
                if (prev == null) tab[idx] = e.next; else prev.next = e.next;
                ++modCount; --size;
                return e;
            }
        }
        return null;
    }

    public int size() { return size; }
    public boolean isEmpty() { return size == 0; }
    public V get(Object k) { Node<K, V> e = getNode(k); return e == null ? null : e.value; }
    public boolean containsKey(Object k) { return getNode(k) != null; }
    public V put(K k, V v) { return putVal(hash(k), k, v, false); }
    public void putAll(java.util.Map<? extends K, ? extends V> m) { putMapEntries(m); }
    public V remove(Object k) { Node<K, V> e = removeNode(k); return e == null ? null : e.value; }
    public void clear() { if (table != null && size > 0) { modCount++; size = 0; for (int i = 0; i < table.length; i++) table[i] = null; } }
    public boolean containsValue(Object v) { if (table != null) for (Node<K, V> e : table) for (; e != null; e = e.next) if (java.util.Objects.equals(e.value, v)) return true; return false; }
    public V getOrDefault(Object k, V d) { Node<K, V> e = getNode(k); return e == null ? d : e.value; }
    public V putIfAbsent(K k, V v) { return putVal(hash(k), k, v, true); }
    public void forEach(java.util.function.BiConsumer<? super K, ? super V> a) {
        if (size > 0 && table != null) {
            int mc = modCount;
            for (Node<K, V> e : table) for (; e != null; e = e.next) a.accept(e.key, e.value);
            if (modCount != mc) throw new java.util.ConcurrentModificationException();
        }
    }

    abstract class HashIt<T> implements java.util.Iterator<T> {
        Node<K, V> next, current; int expected = modCount, index;
        HashIt() { Node<K, V>[] t = table; if (t != null && size > 0) { do { } while (index < t.length && (next = t[index++]) == null); } }
        public final boolean hasNext() { return next != null; }
        final Node<K, V> nextNode() {
            Node<K, V> e = next;
            if (modCount != expected) throw new java.util.ConcurrentModificationException();
            if (e == null) throw new java.util.NoSuchElementException();
            Node<K, V>[] t = table;
            if ((next = (current = e).next) == null && t != null) { do { } while (index < t.length && (next = t[index++]) == null); }
            return e;
        }
        public final void remove() {
            if (current == null) throw new IllegalStateException();
            if (modCount != expected) throw new java.util.ConcurrentModificationException();
            K k = current.key; current = null; removeNode(k); expected = modCount;
        }
    }

    public java.util.Set<java.util.Map$Entry<K, V>> entrySet() {
        return new java.util.AbstractSet<java.util.Map$Entry<K, V>>() {
            public int size() { return size; }
            public void clear() { __HashMap.this.clear(); }
            public java.util.Iterator<java.util.Map$Entry<K, V>> iterator() { return new HashIt<java.util.Map$Entry<K, V>>() { public java.util.Map$Entry<K, V> next() { return nextNode(); } }; }
            public boolean contains(Object o) {
                if (!(o instanceof java.util.Map$Entry)) return false;
                java.util.Map$Entry<?, ?> e = (java.util.Map$Entry<?, ?>) o;
                Node<K, V> c = getNode(e.getKey());
                return c != null && c.equals(e);
            }
            public boolean remove(Object o) { if (contains(o)) { removeNode(((java.util.Map$Entry<?, ?>) o).getKey()); return true; } return false; }
        };
    }
    public java.util.Set<K> keySet() {
        return new java.util.AbstractSet<K>() {
            public int size() { return size; }
            public void clear() { __HashMap.this.clear(); }
            public java.util.Iterator<K> iterator() { return new HashIt<K>() { public K next() { return nextNode().key; } }; }
            public boolean contains(Object o) { return containsKey(o); }
            public boolean remove(Object o) { return removeNode(o) != null; }
        };
    }
    public java.util.Collection<V> values() {
        return new java.util.AbstractCollection<V>() {
            public int size() { return size; }
            public void clear() { __HashMap.this.clear(); }
            public java.util.Iterator<V> iterator() { return new HashIt<V>() { public V next() { return nextNode().value; } }; }
            public boolean contains(Object o) { return containsValue(o); }
        };
    }
}
`;

const HS_SRC = String.raw`
public class __HashSet<E> extends java.util.AbstractSet<E> implements java.util.Set<E> {
    private static final Object P = new Object();
    private final __HashMap<E, Object> map;
    public __HashSet() { map = new __HashMap<>(); }
    public __HashSet(java.util.Collection<? extends E> c) { map = __HashMap.newHashMap(Math.max(c.size(), 12)); addAll(c); }
    public __HashSet(int ic) { map = new __HashMap<>(ic); }
    public __HashSet(int ic, float lf) { map = new __HashMap<>(ic, lf); }
    public static <T> __HashSet<T> newHashSet(int n) { return new __HashSet<>(__HashMap.capFor(n)); }
    public java.util.Iterator<E> iterator() { return map.keySet().iterator(); }
    public int size() { return map.size(); }
    public boolean isEmpty() { return map.isEmpty(); }
    public boolean contains(Object o) { return map.containsKey(o); }
    public boolean add(E e) { return map.put(e, P) == null; }
    public boolean remove(Object o) { return map.remove(o) == P; }
    public void clear() { map.clear(); }
}
`;

const JDK_CLASSES = ['Object', 'String', 'StringBuilder', 'Integer', 'Long', 'Double', 'Float', 'Short', 'Byte', 'Character', 'Boolean', 'Number',
  'java.math.BigDecimal', 'java.math.BigInteger', 'java.util.ArrayList', 'java.util.LinkedList', '__HashMap', '__HashSet', 'java.util.HashMap', 'java.util.HashSet',
  'java.util.LinkedHashMap', 'java.util.LinkedHashSet', 'java.util.TreeMap', 'java.util.TreeSet', 'java.util.ArrayDeque', 'java.util.PriorityQueue', 'java.util.Optional',
  'java.time.LocalDate', 'java.time.LocalDateTime', 'java.time.LocalTime', 'Scanner', 'Throwable', 'Exception', 'Error', 'RuntimeException', 'IllegalArgumentException',
  'IllegalStateException', 'NullPointerException', 'ArithmeticException', 'ArrayIndexOutOfBoundsException', 'IndexOutOfBoundsException', 'StringIndexOutOfBoundsException',
  'NumberFormatException', 'UnsupportedOperationException', 'ClassCastException', 'java.util.NoSuchElementException', 'InputMismatchException',
  'java.util.ConcurrentModificationException', 'CloneNotSupportedException', 'InterruptedException', 'java.io.IOException', 'StackOverflowError', 'AssertionError'];

const ARR = ['int[]', 'long[]', 'double[]', 'float[]', 'char[]', 'byte[]', 'boolean[]', 'short[]', 'String[]', 'Integer[]', 'int[][]', 'double[][]', 'char[][]', 'String[][]', 'Object[]'];

function cSrc(userClasses) {
  const ks = userClasses.filter(c => !c.priv).map(c => c.q).concat(JDK_CLASSES);
  return 'public final class __C {\n' +
    '  static final Class<?>[] K = {' + ks.map(k => k + '.class').join(', ') + '};\n' +
    '  static int touched;\n' +
    '  static { for (Class<?> c : K) { if (c.getName() != null) touched++; if (c.getSimpleName() != null) touched++; } ' + ARR.map(t => 'if (' + t + '.class.getName() != null) touched++; if (' + t + '.class.getSimpleName() != null) touched++; ').join('') + '}\n' +
    '  public static Class<?> of(Object o) {\n' +
    '    if (o == null) throw new NullPointerException();\n' +
    ARR.map(t => '    if (o instanceof ' + t + ') return ' + t + '.class;\n').join('') +
    '    Class<?> best = Object.class;\n' +
    '    for (Class<?> c : K) if (c.isInstance(o) && best.isAssignableFrom(c)) best = c;\n' +
    '    return best;\n  }\n' +
    '  static String name(Class<?> c) {\n' +
    '    String n = c.getName();\n' +
    '    if (n.equals("__HashMap")) return "java.util.HashMap";\n' +
    '    if (n.equals("__HashSet")) return "java.util.HashSet";\n' +
    '    if (n.equals("Scanner") || n.equals("InputMismatchException")) return "java.util." + n;\n' +
    '    return n;\n  }\n' +
    '  public static String nm(Object o) { return name(of(o)); }\n' +
    '  public static String sn(Object o) { String n = of(o).getSimpleName(); return n.startsWith("__Hash") ? n.substring(2) : n; }\n' +
    '  static boolean jdk(String n) { return n.startsWith("java.") || n.startsWith("javax."); }\n' +
    '  static String where(String n) { return jdk(n) ? "module java.base of loader \'bootstrap\'" : "unnamed module of loader \'app\'"; }\n' +
    '  public static Object cc(Object o, Class<?> c) {\n' +
    '    if (o != null && !c.isInstance(o)) {\n' +
    '      String a = name(of(o)), b = name(c);\n' +
    '      String tail = jdk(a) == jdk(b) ? a + " and " + b + " are in " + where(a) : a + " is in " + where(a) + "; " + b + " is in " + where(b);\n' +
    '      throw new ClassCastException("class " + a + " cannot be cast to class " + b + " (" + tail + ")");\n' +
    '    }\n    return o;\n  }\n}\n';
}

function publicName(code) {
  const m = code.match(/\bpublic\s+(?:(?:final|abstract|sealed|non-sealed|strictfp)\s+)*(?:class|record|enum|interface)\s+([A-Za-z_$][\w$]*)/);
  return m ? m[1] : 'Main';
}
const KW = new Set('abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null var yield record sealed permits non-sealed'.split(' '));
const PRIM = new Set(['boolean', 'byte', 'char', 'short', 'int', 'long', 'float', 'double', 'void']);
const PKG_ROOTS = new Set(['java', 'javax', 'jdk', 'sun', 'com', 'org', 'net', 'edu']);
const OPS = ['>>>=', '<<=', '>>=', '>>>', '...', '->', '::', '++', '--', '&&', '||', '==', '!=', '<=', '>=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<'];

function tokenize(code) {
  const t = [];
  let i = 0;
  const n = code.length;
  const isIdStart = c => /[\p{L}_$]/u.test(c);
  const isId = c => /[\p{L}\p{N}_$]/u.test(c);
  while (i < n) {
    const c = code[i], s = i;
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\f') { while (i < n && /\s/.test(code[i])) i++; t.push({ k: 'ws', v: code.slice(s, i), s }); continue; }
    if (c === '/' && code[i + 1] === '/') { const e = code.indexOf('\n', i); i = e < 0 ? n : e; t.push({ k: 'cm', v: code.slice(s, i), s }); continue; }
    if (c === '/' && code[i + 1] === '*') { const e = code.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; t.push({ k: 'cm', v: code.slice(s, i), s }); continue; }
    if (c === '"' && code.startsWith('"""', i)) { let j = i + 3; while (j < n && !code.startsWith('"""', j)) { if (code[j] === '\\') j++; j++; } i = Math.min(n, j + 3); t.push({ k: 'str', v: code.slice(s, i), s }); continue; }
    if (c === '"' || c === "'") { let j = i + 1; while (j < n && code[j] !== c && code[j] !== '\n') { if (code[j] === '\\') j++; j++; } i = Math.min(n, j + 1); t.push({ k: c === '"' ? 'str' : 'chr', v: code.slice(s, i), s }); continue; }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(code[i + 1] || ''))) {
      i++;
      while (i < n && (/[0-9a-zA-Z_.]/.test(code[i]) || ((code[i] === '+' || code[i] === '-') && /[eEpP]/.test(code[i - 1]) && !/^0[xX]/.test(code.slice(s, i)) ))) i++;
      t.push({ k: 'num', v: code.slice(s, i), s }); continue;
    }
    if (isIdStart(c)) { i++; while (i < n && isId(code[i])) i++; t.push({ k: 'id', v: code.slice(s, i), s }); continue; }
    if (c === '@') { t.push({ k: 'op', v: '@', s }); i++; continue; }
    let op = null;
    for (const o of OPS) if (code.startsWith(o, i)) { op = o; break; }
    if (!op) op = c;
    i += op.length;
    t.push({ k: 'op', v: op, s });
  }
  return t;
}

function analyze(code) {
  const T = tokenize(code);
  const sig = [];
  T.forEach((tk, idx) => { if (tk.k !== 'ws' && tk.k !== 'cm') sig.push(idx); });
  const S = sig.map(i => T[i]);
  const match = new Array(S.length).fill(-1);
  const stack = [];
  for (let j = 0; j < S.length; j++) {
    const v = S[j].k === 'op' ? S[j].v : null;
    if (v === '(' || v === '[' || v === '{') stack.push(j);
    else if (v === ')' || v === ']' || v === '}') { const o = stack.pop(); if (o !== undefined) { match[o] = j; match[j] = o; } }
  }
  return { T, S, match };
}

function isTypeVarName(v) { return /^[A-Z][A-Z0-9]?$/.test(v); }
function isConstName(v) { return v.length >= 2 && /^[A-Z0-9_]+$/.test(v); }

function instrument(code, opt) {
  opt = opt || {};
  const { S, match } = analyze(code);
  const ins = [];
  const wrap = (a, b, pre, post) => { ins.push({ pos: a, text: pre, kind: 2, other: b }); ins.push({ pos: b, text: post, kind: 0, other: a }); };
  const startOf = j => S[j].s;
  const endOf = j => S[j].s + S[j].v.length;
  const V = j => (j >= 0 && j < S.length ? S[j].v : '');
  const K = j => (j >= 0 && j < S.length ? S[j].k : '');
  const isOp = (j, v) => K(j) === 'op' && V(j) === v;
  const src = (a, b) => code.slice(startOf(a), endOf(b));
  const jstr = s => '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ') + '"';

  const skip = new Array(S.length).fill(false);
  for (let j = 0; j < S.length; j++) {
    if (K(j) === 'id' && (V(j) === 'import' || V(j) === 'package') && (j === 0 || isOp(j - 1, ';') || isOp(j - 1, '}'))) {
      let k = j; while (k < S.length && !isOp(k, ';')) { skip[k] = true; k++; } skip[k] = true;
    }
    if (isOp(j, '@') && K(j + 1) === 'id') {
      skip[j] = skip[j + 1] = true;
      let k = j + 2; while (isOp(k, '.') && K(k + 1) === 'id') { skip[k] = skip[k + 1] = true; k += 2; }
      if (isOp(k, '(') && match[k] > 0) for (let q = k; q <= match[k]; q++) skip[q] = true;
    }
  }

  function parseTypeArgs(j) {
    if (!isOp(j, '<')) return j;
    let depth = 0, k = j;
    for (; k < S.length; k++) {
      const v = V(k);
      if (K(k) === 'op') {
        if (v === '<') depth++;
        else if (v === '>') depth--;
        else if (v === '>>') depth -= 2;
        else if (v === '>>>') depth -= 3;
        else if (v !== ',' && v !== '.' && v !== '?' && v !== '[' && v !== ']' && v !== '&') return -1;
        if (depth <= 0) return depth === 0 ? k + 1 : -1;
      } else if (K(k) !== 'id') return -1;
    }
    return -1;
  }

  function parseType(j) {
    if (K(j) !== 'id') return null;
    const first = j;
    let k = j + 1;
    while (isOp(k, '.') && K(k + 1) === 'id') k += 2;
    const lastId = k - 1;
    const ta = parseTypeArgs(k);
    if (ta < 0) return null;
    let gen = ta !== k;
    k = ta;
    let dims = 0;
    while (isOp(k, '[') && isOp(k + 1, ']')) { dims++; k += 2; }
    return { first, lastId, end: k - 1, gen, dims, name: src(first, lastId) };
  }

  function parsePrimary(j) {
    const k = K(j), v = V(j);
    if (k === 'num' || k === 'str' || k === 'chr') return j;
    if (k === 'op' && v === '(') { if (match[j] < 0) return -1; if (isOp(match[j] + 1, '->')) return -1; return match[j]; }
    if (k === 'id' && v === 'new') {
      const t = parseType(j + 1);
      let e;
      if (!t) {
        if (K(j + 1) === 'id' && PRIM.has(V(j + 1))) e = j + 1; else return -1;
      } else e = t.end;
      e++;
      if (isOp(e, '(')) { if (match[e] < 0) return -1; e = match[e]; if (isOp(e + 1, '{') && match[e + 1] > 0) e = match[e + 1]; return e; }
      if (isOp(e, '[')) {
        while (isOp(e, '[') && match[e] > 0) e = match[e] + 1;
        if (isOp(e, '{') && match[e] > 0) return match[e];
        return e - 1;
      }
      return -1;
    }
    if (k === 'id' && v === 'switch') return -1;
    if (k === 'id' && (!KW.has(v) || v === 'this' || v === 'super' || v === 'true' || v === 'false' || v === 'null')) {
      if (isOp(j + 1, '(') && match[j + 1] > 0) return match[j + 1];
      return j;
    }
    return -1;
  }

  function parsePostfix(j) {
    let e = parsePrimary(j);
    if (e < 0) return -1;
    for (;;) {
      if (isOp(e + 1, '.')) {
        let q = e + 2;
        q = parseTypeArgs(q);
        if (q < 0) return -1;
        if (K(q) !== 'id') return -1;
        e = q;
        if (isOp(e + 1, '(') && match[e + 1] > 0) e = match[e + 1];
        continue;
      }
      if (isOp(e + 1, '[') && match[e + 1] > 0) { e = match[e + 1]; continue; }
      if (isOp(e + 1, '::')) return -1;
      if (isOp(e + 1, '++') || isOp(e + 1, '--')) { e++; continue; }
      return e;
    }
  }

  function isCastAt(j) {
    if (!isOp(j, '(') || match[j] < 0) return null;
    const c = match[j];
    const t = parseType(j + 1);
    if (!t || t.end !== c - 1) return null;
    return { t, close: c };
  }

  function parseUnary(j) {
    if (K(j) === 'op' && (V(j) === '-' || V(j) === '+' || V(j) === '!' || V(j) === '~' || V(j) === '++' || V(j) === '--')) {
      const e = parseUnary(j + 1); return e;
    }
    const cast = isCastAt(j);
    if (cast && (PRIM.has(cast.t.name) || /^[A-Z]/.test(V(cast.t.lastId)))) {
      const nk = K(cast.close + 1), nv = V(cast.close + 1);
      if (nk === 'id' || nk === 'num' || nk === 'str' || nk === 'chr' || (nk === 'op' && (nv === '(' || (PRIM.has(cast.t.name) && (nv === '-' || nv === '+' || nv === '~' || nv === '!'))))) {
        const e = parseUnary(cast.close + 1);
        if (e >= 0) return e;
      }
    }
    return parsePostfix(j);
  }

  const notes = { casts: 0, nn: 0, ix: 0, dz: 0 };
  const LANG = new Set('Integer Long Double Float Short Byte Character Boolean Number StringBuilder StringBuffer Math Iterable Comparable Runnable Thread CharSequence Exception RuntimeException Throwable Error Enum Record Class'.split(' '));
  const UTIL = new Set('List ArrayList LinkedList Map HashMap TreeMap LinkedHashMap Set HashSet TreeSet LinkedHashSet Queue Deque ArrayDeque PriorityQueue Iterator ListIterator Collection Scanner Optional Random Stack Vector SortedMap SortedSet NavigableMap NavigableSet Objects StringJoiner'.split(' '));
  const userBin = {};
  for (const c of (opt.userClasses || [])) userBin[c.q.split('.').pop()] = c.q.replace(/\./g, '$');
  const decls = [];
  if (opt.nn) {
    for (let j = 1; j < S.length; j++) {
      if (K(j) !== 'id' || KW.has(V(j))) continue;
      const nx = V(j + 1);
      if (!(K(j + 1) === 'op' && ['=', ';', ',', ')', ':'].includes(nx))) continue;
      let p = j - 1, arr = false;
      while (isOp(p, ']') && isOp(p - 1, '[')) { arr = true; p -= 2; }
      if (isOp(p, '>') || isOp(p, '>>')) {
        let depth = 0, b = p;
        for (; b >= 0; b--) { const vv = V(b); if (vv === '>') depth++; else if (vv === '>>') depth += 2; else if (vv === '<') { depth--; if (depth <= 0) break; } else if (!(K(b) === 'id' || [',', '.', '?', '[', ']', '&'].includes(vv))) { b = -1; break; } }
        if (b <= 0) continue;
        p = b - 1;
      }
      if (K(p) !== 'id' || (KW.has(V(p)) && !PRIM.has(V(p)))) continue;
      decls.push({ name: V(j), pos: startOf(j), type: V(p), arr });
    }
  }
  const SIG = {
    'String': { charAt: ['int'], equals: ['Object'], equalsIgnoreCase: ['String'], compareTo: ['String'], contains: ['CharSequence'], startsWith: ['String'], endsWith: ['String'], split: ['String'], concat: ['String'], indexOf: null, substring: { 1: ['int'], 2: ['int', 'int'] } },
    'List': { add: { 1: ['Object'], 2: ['int', 'Object'] }, get: ['int'], set: ['int', 'Object'], contains: ['Object'], indexOf: ['Object'], addAll: ['java.util.Collection'] },
    'Map': { get: ['Object'], put: ['Object', 'Object'], containsKey: ['Object'], containsValue: ['Object'], getOrDefault: ['Object', 'Object'], remove: ['Object'], putIfAbsent: ['Object', 'Object'] },
    'Set': { add: ['Object'], contains: ['Object'], remove: ['Object'] }
  };
  const fam = t => (/^(List|ArrayList|LinkedList)$/.test(t) ? 'List' : /^(Map|HashMap|TreeMap|LinkedHashMap)$/.test(t) ? 'Map' : /^(Set|HashSet|TreeSet|LinkedHashSet)$/.test(t) ? 'Set' : t);
  function display(t) {
    if (t === 'String' || t === 'Object') return t;
    if (userBin[t]) return userBin[t];
    if (LANG.has(t)) return 'java.lang.' + t;
    if (UTIL.has(t)) return 'java.util.' + t;
    return t;
  }
  function argCount(open) {
    const c = match[open];
    if (c < 0) return -1;
    if (c === open + 1) return 0;
    let n = 1;
    for (let q = open + 1; q < c; q++) { if ((isOp(q, '(') || isOp(q, '[') || isOp(q, '{')) && match[q] > q) { q = match[q]; continue; } if (isOp(q, ',')) n++; }
    return n;
  }
  function invokeDesc(v, pos, m, open) {
    let d = null;
    for (const x of decls) if (x.name === v && x.pos < pos) d = x;
    const n = open >= 0 ? argCount(open) : 0;
    if (!d || d.arr) return m + (n === 0 ? '()' : '(...)');
    let params = null;
    const sig = SIG[fam(d.type)];
    if (sig && Object.prototype.hasOwnProperty.call(sig, m) && sig[m]) { const e = sig[m]; params = Array.isArray(e) ? (e.length === n ? e : null) : (e[n] || null); }
    if (!params && n > 0) {
      const c = match[open], parts = [];
      let st = open + 1;
      for (let q = open + 1; q <= c; q++) {
        if (q < c && (isOp(q, '(') || isOp(q, '[') || isOp(q, '{')) && match[q] > q) { q = match[q]; continue; }
        if (q === c || isOp(q, ',')) { parts.push([st, q - 1]); st = q + 1; }
      }
      const inf = parts.map(([a, b]) => {
        if (a !== b) return null;
        const k = K(a), vv = V(a);
        if (k === 'str') return 'String';
        if (k === 'chr') return 'char';
        if (k === 'num') return /[lL]$/.test(vv) ? 'long' : /[fF]$/.test(vv) ? 'float' : (/[.eEdD]/.test(vv) && !/^0[xX]/.test(vv)) ? 'double' : 'int';
        if (k === 'id' && (vv === 'true' || vv === 'false')) return 'boolean';
        if (k === 'id') { let dd = null; for (const x of decls) if (x.name === vv && x.pos < pos) dd = x; if (dd && !dd.arr) return (PRIM.has(dd.type) || dd.type === 'String') ? dd.type : 'Object'; }
        return null;
      });
      if (inf.every(Boolean)) params = inf;
    }
    const ps = n === 0 ? '' : params ? params.join(', ') : '...';
    return display(d.type) + '.' + m + '(' + ps + ')';
  }

  if (opt.casts) {
    for (let j = 0; j < S.length; j++) {
      if (skip[j]) continue;
      const cast = isCastAt(j);
      if (!cast) continue;
      const t = cast.t;
      const last = V(t.lastId);
      if (PRIM.has(t.name) || !/^[A-Z]/.test(last) || t.dims > 0 || isTypeVarName(last) || isConstName(last)) continue;
      if (K(j - 1) === 'id') { const pv = V(j - 1); if (!['return', 'throw', 'case', 'yield', 'else', 'do', 'assert'].includes(pv)) continue; }
      if (isOp(j - 1, ')') || isOp(j - 1, ']') || isOp(j - 1, '.')) continue;
      const nk = K(cast.close + 1), nv = V(cast.close + 1);
      if (!(nk === 'id' || nk === 'str' || nk === 'chr' || (nk === 'op' && nv === '('))) continue;
      if (nk === 'id' && KW.has(nv) && !['this', 'super', 'new', 'null'].includes(nv)) continue;
      const e = parseUnary(cast.close + 1);
      if (e < 0) continue;
      const erased = code.slice(startOf(t.first), endOf(t.lastId)).replace(/\s+/g, '');
      wrap(startOf(cast.close + 1), endOf(e), '__C.cc(', ', ' + erased + '.class)');
      notes.casts++;
    }
  }

  if (opt.nn) {
    for (let j = 0; j < S.length; j++) {
      if (skip[j] || K(j) !== 'id') continue;
      const v = V(j);
      if (KW.has(v) || PKG_ROOTS.has(v) || v.startsWith('__') || !/^[\p{Ll}_]/u.test(v)) continue;
      if (isOp(j - 1, '.') || isOp(j - 1, '@') || isOp(j - 1, '::') || (K(j - 1) === 'id' && V(j - 1) === 'new')) continue;
      if (K(j - 1) === 'id' && !KW.has(V(j - 1))) continue;
      if (isOp(j - 1, '>') || isOp(j - 1, ']')) continue;
      if (!isOp(j + 1, '.') || K(j + 2) !== 'id') continue;
      const m = V(j + 2);
      if (m === 'class' || m === 'this' || m === 'new' || m === 'super') continue;
      if (isOp(j + 3, '<') ) { }
      let msg;
      if (isOp(j + 3, '(') || isOp(j + 3, '<')) msg = 'Cannot invoke "' + invokeDesc(v, startOf(j), m, isOp(j + 3, '(') ? j + 3 : -1) + '" because "' + v + '" is null';
      else if (m === 'length') msg = 'Cannot read the array length because "' + v + '" is null';
      else if (K(j + 3) === 'op' && /^(=|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|<<=|>>=|>>>=)$/.test(V(j + 3))) msg = 'Cannot assign field "' + m + '" because "' + v + '" is null';
      else msg = 'Cannot read field "' + m + '" because "' + v + '" is null';
      wrap(startOf(j), endOf(j), '__J.nn(', ', ' + jstr(msg) + ')');
      notes.nn++;
    }
  }

  if (opt.ix) {
    for (let j = 0; j < S.length; j++) {
      if (skip[j] || K(j) !== 'id') continue;
      const v = V(j);
      if (!(v === 'this' || (!KW.has(v) && !PKG_ROOTS.has(v) && !v.startsWith('__') && /^[\p{Ll}_]/u.test(v)))) continue;
      if (isOp(j - 1, '.') || isOp(j - 1, '@') || isOp(j - 1, '::')) continue;
      if (K(j - 1) === 'id' && !KW.has(V(j - 1))) continue;
      if (K(j - 1) === 'id' && V(j - 1) === 'new') continue;
      if (isOp(j - 1, '>') || isOp(j - 1, ']')) continue;
      let e = j;
      while (isOp(e + 1, '.') && K(e + 2) === 'id' && !KW.has(V(e + 2))) e += 2;
      if (v === 'this' && e === j) continue;
      let recvEnd = e, depth = 0;
      while (isOp(recvEnd + 1, '[') && match[recvEnd + 1] > recvEnd + 2 && depth < 4) {
        const o = recvEnd + 1, c = match[o];
        const store = K(c + 1) === 'op' && /^(=|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|<<=|>>=|>>>=)$/.test(V(c + 1));
        const name = code.slice(startOf(j), endOf(recvEnd)).replace(/\s+/g, '');
        ins.push({ pos: startOf(j), text: '__J.A(', kind: 2, other: endOf(c) });
        ins.push({ pos: startOf(o), del: 1, text: ', ', kind: 1, other: 0 });
        ins.push({ pos: startOf(c), del: 1, text: ', ' + jstr(name) + ', ' + (store ? 'true' : 'false') + ')[__J.I]', kind: 0, other: startOf(j) });
        notes.ix++;
        recvEnd = c;
        depth++;
      }
    }
  }

  function backPrimary(j) {
    let q = j;
    if ((isOp(q, ')') || isOp(q, ']')) && match[q] >= 0) {
      const o = match[q];
      if (isOp(q, ')') && K(o - 1) === 'id' && !KW.has(V(o - 1))) q = o - 1;
      else if (isOp(q, ']')) { q = o; const r = backPrimary(o - 1); if (r < 0) return -1; return r; }
      else q = o;
    } else if (K(q) === 'id' || K(q) === 'num' || K(q) === 'str' || K(q) === 'chr') {
      if (K(q) === 'id' && KW.has(V(q)) && !['this', 'super', 'true', 'false', 'null'].includes(V(q))) return -1;
    } else return -1;
    while (isOp(q - 1, '.')) {
      const p = q - 2;
      if ((isOp(p, ')') || isOp(p, ']')) && match[p] >= 0) { const o = match[p]; q = (isOp(p, ')') && K(o - 1) === 'id' && !KW.has(V(o - 1))) ? o - 1 : o; if (isOp(p, ']')) { const r = backPrimary(p); if (r < 0) return -1; q = r; } }
      else if (K(p) === 'id') q = p;
      else return -1;
    }
    if (K(q - 1) === 'id' && V(q - 1) === 'new') q--;
    return q;
  }
  function backUnary(j) {
    let q = backPrimary(j);
    if (q < 0) return -1;
    for (;;) {
      const p = q - 1;
      if (K(p) === 'op' && ['-', '+', '!', '~', '++', '--'].includes(V(p))) {
        const pp = p - 1;
        const binaryCtx = (K(pp) === 'id' && !KW.has(V(pp))) || K(pp) === 'num' || K(pp) === 'str' || K(pp) === 'chr' || isOp(pp, ')') || isOp(pp, ']');
        if (binaryCtx && (V(p) === '-' || V(p) === '+')) return q;
        if (binaryCtx) return q;
        q = p; continue;
      }
      if (isOp(p, ')') && match[p] >= 0) {
        const o = match[p];
        const t = parseType(o + 1);
        const prevIsCall = K(o - 1) === 'id' && !KW.has(V(o - 1));
        if (t && t.end === p - 1 && !prevIsCall && (PRIM.has(t.name) || /^[A-Z]/.test(V(t.lastId)))) { q = o; continue; }
      }
      return q;
    }
  }

  if (opt.dz) {
    for (let j = 0; j < S.length; j++) {
      if (skip[j] || !(isOp(j, '/') || isOp(j, '%'))) continue;
      const e = parseUnary(j + 1);
      if (e < 0) continue;
      if (e === j + 1 && K(j + 1) === 'num') {
        const lit = V(j + 1).replace(/_/g, '').replace(/[lLfFdD]$/, '');
        if (/[.eE]/.test(lit) && !/^0[xX]/.test(lit)) continue;
        if (Number(lit) !== 0) continue;
      }
      let st = backUnary(j - 1);
      if (st < 0) continue;
      for (;;) {
        const p = st - 1;
        if (K(p) === 'op' && ['*', '/', '%'].includes(V(p))) { const s2 = backUnary(p - 1); if (s2 < 0) { st = -1; break; } st = s2; continue; }
        break;
      }
      if (st < 0) continue;
      const fn = isOp(j, '/') ? '__J.div(' : '__J.mod(';
      ins.push({ pos: startOf(st), text: fn, kind: 2, other: endOf(e) });
      ins.push({ pos: startOf(j), del: 1, text: ',', kind: 1, other: 0 });
      ins.push({ pos: endOf(e), text: ')', kind: 0, other: startOf(st) });
      notes.dz++;
    }
  }

  if (opt.hm) {
    for (let j = 0; j < S.length; j++) {
      if (skip[j] || K(j) !== 'id') continue;
      const v = V(j);
      if (v !== 'HashMap' && v !== 'HashSet') continue;
      if (isOp(j - 1, '.')) {
        if (V(j - 2) === 'util' && isOp(j - 3, '.') && V(j - 4) === 'java') ins.push({ pos: startOf(j - 4), del: endOf(j) - startOf(j - 4), text: '__' + v, kind: 1, other: 0 });
        continue;
      }
      if (isOp(j + 1, '.') && K(j + 2) === 'id' && /^[A-Z]/.test(V(j + 2))) continue;
      ins.push({ pos: startOf(j), del: v.length, text: '__' + v, kind: 1, other: 0 });
    }
  }

  function recvStart(j) {
    let q = j;
    for (;;) {
      if ((isOp(q, ')') || isOp(q, ']')) && match[q] >= 0) {
        q = match[q];
        if (isOp(q - 1, '>')) {
          let depth = 0, b = q - 1;
          for (; b >= 0; b--) { const vv = V(b); if (vv === '>') depth++; else if (vv === '>>') depth += 2; else if (vv === '<') { depth--; if (depth === 0) break; } else if (!(K(b) === 'id' || vv === ',' || vv === '.' || vv === '?' || vv === '[' || vv === ']')) { b = -1; break; } }
          if (b > 0 && K(b - 1) === 'id') q = b - 1; else return -1;
        } else if (K(q - 1) === 'id' && !KW.has(V(q - 1))) q--;
        else if (isOp(q, '[')) { q--; continue; }
      }
      else if (K(q) === 'id' || K(q) === 'str' || K(q) === 'num' || K(q) === 'chr') { }
      else return -1;
      if (isOp(q - 1, '.')) { q -= 2; continue; }
      if (K(q - 1) === 'id' && V(q - 1) === 'new') q--;
      return q;
    }
  }
  if (opt.hc) {
    for (let j = 0; j < S.length; j++) {
      if (skip[j] || K(j) !== 'str' || V(j).startsWith('"""')) continue;
      if (!(isOp(j + 1, '.') && V(j + 2) === 'hashCode' && isOp(j + 3, '(') && isOp(j + 4, ')'))) continue;
      if (isOp(j - 1, '.')) continue;
      const lit = V(j).slice(1, -1);
      let str = '', ok = true;
      for (let q = 0; q < lit.length; q++) {
        const ch = lit[q];
        if (ch !== '\\') { str += ch; continue; }
        const nx = lit[++q];
        const map = { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', s: ' ', '"': '"', "'": "'", '\\': '\\' };
        if (nx in map) str += map[nx];
        else if (nx === 'u') { let u = q; while (lit[u + 1] === 'u') u++; const hex = lit.slice(u + 1, u + 5); if (!/^[0-9a-fA-F]{4}$/.test(hex)) { ok = false; break; } str += String.fromCharCode(parseInt(hex, 16)); q = u + 4; }
        else if (/[0-7]/.test(nx)) { let oct = nx; while (oct.length < 3 && /[0-7]/.test(lit[q + 1] || '') && parseInt(oct + lit[q + 1], 8) <= 255) oct += lit[++q]; str += String.fromCharCode(parseInt(oct, 8)); }
        else { ok = false; break; }
      }
      if (!ok) continue;
      let h = 0;
      for (let q = 0; q < str.length; q++) h = (Math.imul(31, h) + str.charCodeAt(q)) | 0;
      ins.push({ pos: startOf(j), del: endOf(j + 4) - startOf(j), text: h < 0 ? '(' + h + ')' : String(h), kind: 1, other: 0 });
    }
  }
  if (opt.nest && opt.nest.length) {
    for (let j = 0; j < S.length; j++) {
      if (K(j) !== 'id') continue;
      for (const nb of opt.nest) {
        if (V(j) !== nb.outer || !isOp(j + 1, '.') || V(j + 2) !== nb.inner) continue;
        let st = j;
        if (isOp(j - 1, '.')) {
          const segs = nb.pkg.split('.');
          let q = j - 1, okp = true;
          for (let si = segs.length - 1; si >= 0; si--) { if (!isOp(q, '.') || V(q - 1) !== segs[si]) { okp = false; break; } q -= 2; }
          if (!okp) continue;
          st = q + 1;
        }
        ins.push({ pos: startOf(st), del: endOf(j + 2) - startOf(st), text: nb.pkg + '.' + nb.outer + '$' + nb.inner, kind: 1, other: 0 });
      }
    }
  }
  const methRe = { gc: /^getClass$/, gm: /^get(Localized)?Message$/ };
  for (const key of ['gc', 'gm']) {
    if (!opt[key]) continue;
    for (let j = 0; j < S.length; j++) {
      if (skip[j] || K(j) !== 'id' || !methRe[key].test(V(j)) || !isOp(j + 1, '(') || !isOp(j + 2, ')')) continue;
      if (key === 'gm' && !(isOp(j - 1, '.') && opt.gm.includes(startOf(j - 1)))) continue;
      let fn = key === 'gc' ? '__C.of(' : '__J.msg(';
      let endTok = j + 2;
      if (key === 'gc' && isOp(j + 3, '.') && (V(j + 4) === 'getName' || V(j + 4) === 'getSimpleName') && isOp(j + 5, '(') && isOp(j + 6, ')')) {
        fn = V(j + 4) === 'getName' ? '__C.nm(' : '__C.sn(';
        endTok = j + 6;
      }
      if (isOp(j - 1, '.')) {
        const r = recvStart(j - 2);
        if (r < 0) continue;
        ins.push({ pos: startOf(r), text: fn, kind: 2, other: endOf(endTok) });
        ins.push({ pos: endOf(j - 2), del: endOf(endTok) - endOf(j - 2), text: ')', kind: 0, other: startOf(r) });
      } else if (key === 'gc' && !(K(j - 1) === 'id' && !KW.has(V(j - 1)))) {
        ins.push({ pos: startOf(j), del: endOf(endTok) - startOf(j), text: fn + 'this)', kind: 1, other: 0 });
      }
    }
  }

  ins.sort((a, b) => a.pos - b.pos || a.kind - b.kind || b.other - a.other);
  let out = '', p = 0;
  for (const x of ins) {
    if (x.pos < p) { if (!x.del) out += x.text; continue; }
    out += code.slice(p, x.pos) + x.text;
    p = x.pos + (x.del || 0);
  }
  out += code.slice(p);
  return { code: out, notes };
}

function declaredClasses(code) {
  const { S, match } = analyze(code);
  const res = [];
  const stack = [];
  let pending = null;
  for (let j = 0; j < S.length; j++) {
    const k = S[j].k, v = S[j].v;
    if (k === 'id' && (v === 'class' || v === 'enum' || v === 'record' || v === 'interface') && !(j > 0 && S[j - 1].v === '.') && S[j + 1] && S[j + 1].k === 'id') {
      let mods = [];
      for (let q = j - 1; q >= 0 && S[q].k === 'id' && KW.has(S[q].v); q--) mods.push(S[q].v);
      if (j > 0 && S[j - 1].v === '@') { continue; }
      pending = { name: S[j + 1].v, kind: v, priv: mods.includes('private'), abs: mods.includes('abstract'), memberLevel: stack.every(x => x.type) };
      continue;
    }
    if (k === 'op' && v === '{') {
      if (pending) {
        const outer = stack.filter(x => x.type).map(x => x.name);
        const q = outer.concat([pending.name]).join('.');
        if (pending.memberLevel && pending.kind !== 'interface') res.push({ q, priv: pending.priv || stack.some(x => x.type && x.priv), abs: pending.abs, kind: pending.kind });
        stack.push({ type: true, name: pending.name, priv: pending.priv });
        pending = null;
      } else stack.push({ type: false });
      continue;
    }
    if (k === 'op' && v === '}') { stack.pop(); continue; }
    if (k === 'op' && v === ';' && pending && stack.length === 0) pending = null;
  }
  return res;
}


let comp = null, loadFn = null, diags = [], LIB = null, FILES0 = null;
const OUT_CAP = 200000;

async function coreInit(files) {
  const body = files.rt.replace(/export\s*\{[^}]*\}\s*;?\s*$/, '') + '\nreturn { load: s };';
  loadFn = (new Function(body))().load;
  LIB = (await loadFn(new Int8Array(files.wasm))).exports;
  FILES0 = files;
  newComp();
}

function newComp() {
  comp = LIB.createCompiler();
  comp.setSdk(new Int8Array(FILES0.sdk));
  comp.setTeaVMClasslib(new Int8Array(FILES0.cls));
  comp.onDiagnostic(x => {
    const g = k => { try { return x[k]; } catch (e) { return null; } };
    diags.push({ sev: g('severity'), file: g('fileName'), line: g('lineNumber'), col: g('columnNumber'), msg: String(g('message') || '') });
  });
}

function offsetOf(code, line, col) {
  let p = 0;
  for (let l = 1; l < line; l++) { const e = code.indexOf('\n', p); if (e < 0) return -1; p = e + 1; }
  return p + col - 1;
}

function compileSet(fname, userCode, extra) {
  diags = [];
  comp.clearSourceFiles(); comp.clearOutputFiles();
  comp.addSourceFile(fname, userCode);
  for (const [n, s] of extra) comp.addSourceFile(n, s);
  let ok;
  try { ok = comp.compile(); }
  catch (e) {
    try { newComp(); } catch (e2) { }
    return { ok: false, crashed: true, diags: [{ sev: 'error', file: fname, line: 0, col: 0, msg: 'Bộ biên dịch trong trình duyệt bị lỗi nội bộ với đoạn code này (' + String(e && e.message || e).slice(0, 80) + '). Hãy bấm "JDK thật ↗".' }] };
  }
  return { ok, diags: diags.slice() };
}

async function coreRun(code, input, interactive, post) {
  const t0 = Date.now();
  const base = rewrite(code, false);
  const fname = publicName(base.code) + '.java';
  const shim = [['Scanner.java', SCANNER_SRC], ['InputMismatchException.java', IME_SRC], ['__NeedInput.java', NEED_SRC], ['__J.java', FMT_SRC], ['__In.java', inSrc(input, true, interactive)], ['__HashMap.java', HM_SRC], ['__HashSet.java', HS_SRC]];
  const userErr = r => r.diags.filter(d => (!d.sev || /error/i.test(d.sev)) && d.msg);
  post({ t: 'phase', p: 'compile' });

  let c0 = base.code, gc = false, gm = [], nest = [], r = compileSet(fname, c0, shim);
  for (let iter = 0; iter < 4 && !r.ok; iter++) {
    const errs = userErr(r);
    let changed = false;
    if (!gc && errs.some(d => /method getClass\(\)/.test(d.msg))) { gc = true; changed = true; }
    if (iter === 0) for (const d of errs) if (/method get(Localized)?Message\(\)/.test(d.msg) && d.line > 0 && d.col > 0) { const off = offsetOf(base.code, d.line, d.col); if (off >= 0 && !gm.includes(off)) { gm.push(off); changed = true; } }
    for (const d of errs) {
      const mm = d.msg.match(/symbol:\s+class\s+([\w$]+)\s*\n\s*location:\s+(?:class|interface)\s+([\w.]+)\.([\w$]+)/);
      if (mm && !nest.some(x => x.outer === mm[3] && x.inner === mm[1])) { nest.push({ pkg: mm[2], outer: mm[3], inner: mm[1] }); changed = true; }
    }
    if (!changed) break;
    c0 = instrument(base.code, { gc, gm, nest }).code;
    const cls = gc ? [['__C.java', cSrc(declaredClasses(base.code))]] : [];
    r = compileSet(fname, c0, shim.concat(cls));
    if (!r.ok && gc && userErr(r).some(d => /__C\.java/.test(d.file || ''))) r = compileSet(fname, c0, shim.concat([['__C.java', cSrc([])]]));
  }
  if (!r.ok) { post({ t: 'diags', fname, list: userErr(r).length ? userErr(r) : r.diags, fixed: gc || gm.length > 0 || nest.length > 0 }); return; }

  const users = declaredClasses(base.code);
  const fmtCode = instrument(rewrite(c0, true).code, { hc: 1 }).code;
  const levels = [
    { name: 'full', opt: { casts: 1, nn: 1, ix: 1, dz: 1, hm: 1, userClasses: users }, cls: users },
    { name: 'full', opt: { casts: 1, nn: 1, ix: 1, dz: 1, hm: 1, userClasses: users }, cls: [] },
    { name: 'basic', opt: { hm: 1 }, cls: [] },
    { name: 'none', opt: {}, cls: [] }
  ];
  let used = null, mains = null, lastGen = [], t1 = Date.now();
  for (const L of levels) {
    const ic = instrument(fmtCode, L.opt).code;
    const rr = compileSet(fname, ic, shim.concat([['__C.java', cSrc(L.cls)]]));
    if (!rr.ok) continue;
    if (!mains) {
      mains = [...comp.detectMainClasses()].filter(m => !m.startsWith('__') && m !== 'Scanner' && m !== 'InputMismatchException');
      if (!mains.length) { post({ t: 'nomain' }); return; }
    }
    comp.addSourceFile('__Run.java', runnerSrc(mains[0]));
    comp.clearOutputFiles();
    diags = [];
    let okc2 = false;
    try { okc2 = comp.compile(); } catch (e) { newComp(); }
    if (!okc2) continue;
    t1 = Date.now();
    post({ t: 'phase', p: 'build' });
    let ok = false;
    diags = [];
    try { ok = await comp.generateWebAssembly({ outputName: 'app', mainClass: '__Run' }); } catch (e) { ok = false; try { newComp(); } catch (e2) { } }
    if (ok) { used = L; break; }
    lastGen = diags.slice();
  }
  if (!used) { post(lastGen.length ? { t: 'unsupported', list: lastGen } : { t: 'diags', fname, list: userErr(r), fixed: false }); return; }
  const wasm = comp.getWebAssemblyOutputFile('app.wasm');
  const t2 = Date.now();
  let buf = '', total = 0, last = Date.now(), cut = false, isErr = false, lines = 0;
  const flush = () => { if (buf) { post({ t: 'out', s: buf, err: isErr }); buf = ''; } last = Date.now(); lines = 0; };
  const put = (err) => (ch) => {
    if (cut) return;
    if (err !== isErr) { flush(); isErr = err; }
    buf += String.fromCharCode(ch);
    if (++total > OUT_CAP) { cut = true; flush(); post({ t: 'cut' }); return; }
    if (ch === 10 && (++lines < 30 || Date.now() - last > 60)) flush();
  };
  const app = await loadFn(wasm, { installImports(o) { o.teavmConsole.putcharStdout = put(false); o.teavmConsole.putcharStderr = put(true); } });
  post({ t: 'start', main: mains[0] });
  const t3 = Date.now();
  let trap = null;
  try { app.exports.main([]); } catch (e) { trap = String(e && e.message || e); }
  flush();
  post({ t: 'done', trap, level: used.name, ms: { compile: t1 - t0, build: t2 - t1, run: Date.now() - t3 }, main: mains[0], notes: base.notes });
}

return { coreInit, coreRun };
};
const CSS = ".jr{padding:.5rem 0}.jr-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.jr-lbl{font-size:13px;color:var(--text-secondary)}.jr-ed{width:100%;min-height:320px;font-family:var(--font-mono);font-size:13.5px;line-height:1.55;padding:10px 12px;border:0.5px solid var(--border-strong);border-radius:var(--radius);background:var(--surface-1);color:var(--text-primary);tab-size:4;white-space:pre;resize:vertical}.jr .CodeMirror{height:auto;min-height:300px;font-family:var(--font-mono);font-size:13.5px;line-height:1.55;border:0.5px solid var(--border-strong);border-radius:var(--radius);background:var(--surface-1);color:var(--text-primary)}.jr .CodeMirror-scroll{min-height:300px;max-height:560px}.jr .CodeMirror-gutters{background:var(--surface-1);border-right:0.5px solid var(--border)}.jr .CodeMirror-linenumber{color:var(--text-muted)}.jr .CodeMirror-cursor{border-left:1.5px solid var(--text-primary)}.jr .CodeMirror-selected,.jr .CodeMirror-focused .CodeMirror-selected{background:var(--bg-accent)}.jr .CodeMirror-matchingbracket{color:var(--text-accent)!important;text-decoration:underline}.jr .cm-keyword{color:var(--text-pro,#7F77DD)}.jr .cm-type,.jr .cm-variable-3{color:var(--text-accent)}.jr .cm-string{color:var(--text-success)}.jr .cm-number{color:var(--text-warning)}.jr .cm-comment{color:var(--text-muted);font-style:italic}.jr .cm-meta{color:var(--text-warning)}.jr .jr-errline{background:var(--bg-danger)}.jr-in{width:100%;min-height:38px;height:38px;font-family:var(--font-mono);font-size:13px;padding:8px 10px;border:0.5px solid var(--border-strong);border-radius:var(--radius);background:var(--surface-1);color:var(--text-primary);resize:vertical}.jr-run{background:var(--fill-primary)!important;color:var(--on-primary)!important;border-color:var(--fill-primary)!important}.jr-out{margin:10px 0 0;min-height:64px;max-height:360px;overflow:auto;font-family:var(--font-mono);font-size:13px;line-height:1.5;padding:10px 12px;border-radius:var(--radius);background:var(--bg-neutral);color:var(--text-primary);white-space:pre-wrap;word-break:break-word}.jr-out .e{color:var(--text-danger)}.jr-out .i{color:var(--text-accent);text-decoration:underline;text-decoration-style:dotted}.jr-out .m{color:var(--text-secondary)}.jr-out .lnk{cursor:pointer;text-decoration:underline}.jr-st{font-size:12px;color:var(--text-secondary)}.jr-cin{font:inherit;color:var(--text-accent);background:transparent;border:0;border-bottom:1px dashed var(--border-accent,var(--text-accent));outline:none;padding:0 2px;min-width:8ch;width:24ch;height:auto}.jr .cm-def,.jr .cm-variable-2,.jr .cm-atom{color:var(--text-accent)}";
const HTML = "<div class=\"jr\">\n<div class=\"jr-row\" style=\"margin-bottom:10px\">\n<label class=\"jr-lbl\" for=\"jr-pick\">Ví dụ</label>\n<select id=\"jr-pick\" style=\"flex:1;min-width:220px\"></select>\n</div>\n<textarea id=\"jr-code\" class=\"jr-ed\" spellcheck=\"false\" aria-label=\"Code Java\"></textarea>\n<div style=\"margin-top:10px\">\n<label class=\"jr-lbl\" for=\"jr-in\">Input cho Scanner, có thể để trống: khi chương trình cần nhập, ô nhập sẽ hiện ngay trong khung kết quả</label>\n<textarea id=\"jr-in\" class=\"jr-in\" spellcheck=\"false\" placeholder=\"Để trống hoặc nhập sẵn, ví dụ: 5 10\"></textarea>\n</div>\n<div class=\"jr-row\" style=\"margin-top:10px\">\n<button id=\"jr-go\" class=\"jr-run\"><i class=\"ti ti-player-play\" aria-hidden=\"true\"></i> Chạy</button>\n<button id=\"jr-reset\"><i class=\"ti ti-refresh\" aria-hidden=\"true\"></i> Đặt lại</button>\n<button id=\"jr-copy\"><i class=\"ti ti-copy\" aria-hidden=\"true\"></i> <span id=\"jr-copy-t\">Copy</span></button>\n<button id=\"jr-jdk\" title=\"Gửi code cho Claude chạy bằng JDK 21 thật\"><i class=\"ti ti-server\" aria-hidden=\"true\"></i> JDK thật ↗</button>\n<button id=\"jr-ask\" style=\"display:none\"><i class=\"ti ti-message-question\" aria-hidden=\"true\"></i> Giải thích lỗi ↗</button>\n<span id=\"jr-err\" style=\"font-size:13px;color:var(--text-danger)\"></span>\n</div>\n<pre id=\"jr-out\" class=\"jr-out\" aria-live=\"polite\"><span class=\"m\">Bấm Chạy (hoặc Ctrl+Enter). Lần đầu sẽ tải trình biên dịch Java ~6,7 MB.</span></pre>\n<div class=\"jr-row\" style=\"margin-top:6px;justify-content:space-between\">\n<span id=\"jr-st\" class=\"jr-st\">Chưa tải trình biên dịch</span>\n<details style=\"font-size:12px;color:var(--text-secondary)\"><summary style=\"cursor:pointer\">Giới hạn của bản chạy trong trình duyệt</summary>\n<div style=\"max-width:480px;padding:6px 0;line-height:1.6\">javac 21 (OpenJDK) + TeaVM chạy ngay trên máy bạn, không gửi code đi đâu. Đã vá để giống JDK: NullPointerException, ArrayIndexOutOfBounds, chia cho 0, ClassCastException (bắt được bằng try/catch, thông báo như JDK), <code>getClass()</code>, <code>getMessage()</code>, <code>printf</code>, <code>Scanner</code>, thứ tự in của HashMap/HashSet, <code>Map.Entry</code>.<br>Chưa hỗ trợ: Thread/đa luồng, đọc ghi file, tự định nghĩa annotation (<code>@interface</code>), stack trace có số dòng. Ngoài ra: lỗi trong biểu thức phức tạp (ví dụ <code>a.b().c()</code> khi <code>b()</code> trả null) và đệ quy quá sâu vẫn dừng chương trình. Gặp mấy trường hợp này thì bấm \"JDK thật ↗\". Cần trình duyệt mới (Chrome/Edge 119+, Firefox 120+, Safari 18.2+).</div></details>\n</div>\n</div>";
const CM = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/";
let cmPromise = null;
function loadCM() {
  if (cmPromise) return cmPromise;
  const add = (tag, attrs) => new Promise((res, rej) => { const el = document.createElement(tag); Object.assign(el, attrs); el.onload = res; el.onerror = rej; document.head.appendChild(el); });
  cmPromise = add('link', { rel: 'stylesheet', href: CM + 'codemirror.min.css' }).catch(() => {})
    .then(() => window.CodeMirror ? null : add('script', { src: CM + 'codemirror.min.js' }))
    .then(() => Promise.all(['mode/clike/clike.min.js', 'addon/edit/matchbrackets.min.js', 'addon/edit/closebrackets.min.js'].map(f => add('script', { src: CM + f }))))
    .catch(() => {});
  return cmPromise;
}
function mount(root, opts) {
  opts = opts || {};
  if (typeof root === 'string') root = document.querySelector(root);
  root.innerHTML = '<style>' + CSS + '</style>' + HTML;
  const ui = (function () {

const LESSON = opts.lesson || 'Java';
const BASE = 'https://cdn.jsdelivr.net/npm/@browserrun/java@0.1.0/';
const FILES = {
  rt: ['compiler.wasm-runtime.js', '75b2b94394f162c384d42d540836375cdbb0207e6e5605b92a18ce56eb158741'],
  wasm: ['compiler.wasm', 'a79245353ac623df4fde5740bb2bedacedc9c98544253f01aa4b63268f9cb8ba'],
  sdk: ['compile-classlib-teavm.bin', '4ed72de9e6ea1b58adfaa1b75c30379d7bccde71c529f795df383d62045367d9'],
  cls: ['runtime-classlib-teavm.bin', 'e62ab99ce291a3379abc0756a1e80f4796f00c60fee655e488b82e37b469d5b7']
};
const RUN_LIMIT = 8000;
const $ = id => root.querySelector('#' + id);
const pick = $('jr-pick'), outEl = $('jr-out'), st = $('jr-st'), errEl = $('jr-err'), askBtn = $('jr-ask'), goBtn = $('jr-go');
const exs = (opts.examples && opts.examples.length) ? opts.examples : [{ name: 'Code', code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Xin chào");\n    }\n}' }];
exs.forEach((e, i) => { const o = document.createElement('option'); o.value = String(i); o.textContent = e.name; pick.appendChild(o); });
const names = exs.map(e => e.name);
const ex = exs.map(e => String(e.code).replace(/^\n+|\s+$/g, ''));
const exIn = exs.map(e => e.input || '');
$('jr-code').value = ex[0];
$('jr-in').value = exIn[0];
const draft = ex.slice();
let cur = 0, cm = null;

const getCode = () => cm ? cm.getValue() : $('jr-code').value;
const setCode = v => { if (cm) { cm.setValue(v); clearMarks(); } else $('jr-code').value = v; };
let marks = [];
function clearMarks() { if (cm) { marks.forEach(l => cm.removeLineClass(l, 'background', 'jr-errline')); } marks = []; }
function markLine(n) { if (cm && n > 0 && n <= cm.lineCount()) { const h = cm.addLineClass(n - 1, 'background', 'jr-errline'); marks.push(h); } }
function jump(n) { if (cm) { cm.focus(); cm.setCursor({ line: n - 1, ch: 0 }); cm.scrollIntoView(null, 80); } }

function upgradeEditor() {
  if (cm || !window.CodeMirror || !CodeMirror.modes || !CodeMirror.modes.clike) return;
  try {
    const cur0 = $('jr-code').value;
    cm = CodeMirror.fromTextArea($('jr-code'), {
      mode: 'text/x-java', lineNumbers: true, indentUnit: 4, tabSize: 4, matchBrackets: true, autoCloseBrackets: true, viewportMargin: Infinity,
      extraKeys: { Tab: c => c.somethingSelected() ? c.indentSelection('add') : c.replaceSelection('    '), 'Shift-Tab': c => c.indentSelection('subtract'), 'Ctrl-Enter': () => run(), 'Cmd-Enter': () => run() }
    });
    cm.setValue(cur0);
    cm.on('change', () => { errEl.textContent = ''; });
  } catch (e) { cm = null; }
}
{
  const ta = $('jr-code');
  ta.addEventListener('keydown', e => {
    if (cm) return;
    if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart, t = ta.selectionEnd; ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(t); ta.selectionStart = ta.selectionEnd = s + 4; }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); }
  });
}
$('jr-in').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); } });

pick.addEventListener('change', () => { draft[cur] = getCode(); cur = +pick.value; setCode(draft[cur]); errEl.textContent = ''; $('jr-in').value = exIn[cur]; });
$('jr-reset').addEventListener('click', () => { draft[cur] = ex[cur]; setCode(ex[cur]); errEl.textContent = ''; $('jr-in').value = exIn[cur]; });
$('jr-copy').addEventListener('click', async () => {
  const t = $('jr-copy-t');
  try { await navigator.clipboard.writeText(getCode()); t.textContent = 'Đã copy'; } catch (e) { t.textContent = 'Không copy được'; }
  setTimeout(() => { t.textContent = 'Copy'; }, 1500);
});

const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
let plain = '', needInput = false;
function clearOut() { outEl.innerHTML = ''; plain = ''; needInput = false; }
function addOut(s, cls) {
  if (/\uE002/.test(s)) { needInput = true; s = s.replace(/\uE002/g, ''); if (!s) return; }
  plain += s;
  let html = '';
  if (!cls) {
    html = esc(s).replace(/\uE000([\s\S]*?)\uE001/g, (m, t) => t ? '<span class="i">' + t + '</span>\n' : '');
    plain = plain.replace(/\uE000([\s\S]*?)\uE001/g, (m, t) => t ? t + '\n' : '');
  } else html = '<span class="' + cls + '">' + esc(s) + '</span>';
  outEl.insertAdjacentHTML('beforeend', html);
  outEl.scrollTop = outEl.scrollHeight;
}
function addLink(text, line) {
  const sp = document.createElement('span'); sp.className = 'e lnk'; sp.textContent = text;
  sp.addEventListener('click', () => jump(line)); outEl.appendChild(sp); plain += text;
}

const TRAPS = [
  [/null pointer|null reference/i, 'java.lang.NullPointerException'],
  [/out of bounds/i, 'java.lang.ArrayIndexOutOfBoundsException'],
  [/divide by zero|division by zero/i, 'java.lang.ArithmeticException: / by zero'],
  [/call stack|stack size|too much recursion/i, 'java.lang.StackOverflowError'],
  [/illegal cast|cast/i, 'java.lang.ClassCastException']
];

let worker = null, api = null, files = null, ready = null, busy = false, timer = null, inline = false, onMsg = null;

async function fetchVerified(key, done) {
  const [name, hash] = FILES[key];
  const r = await fetch(BASE + name);
  if (!r.ok) throw new Error('Không tải được ' + name + ' (HTTP ' + r.status + ')');
  const buf = await r.arrayBuffer();
  done(buf.byteLength);
  if (!(crypto && crypto.subtle)) throw new Error('Trình duyệt không hỗ trợ kiểm tra SHA-256 nên không dám dùng file');
  const h = [...new Uint8Array(await crypto.subtle.digest('SHA-256', buf))].map(b => b.toString(16).padStart(2, '0')).join('');
  if (h !== hash) throw new Error('File ' + name + ' sai mã SHA-256, đã từ chối để an toàn');
  return buf;
}

async function loadFiles() {
  let got = 0;
  const tick = n => { got += n; st.textContent = 'Đang tải trình biên dịch… ' + (got / 1048576).toFixed(1) + ' / 6,7 MB'; };
  st.textContent = 'Đang tải trình biên dịch…';
  const [rt, wasm, sdk, cls] = await Promise.all(['rt', 'wasm', 'sdk', 'cls'].map(k => fetchVerified(k, tick)));
  st.textContent = 'Đã kiểm tra SHA-256 cả 4 file, đang khởi động…';
  return { rt: new TextDecoder().decode(rt), wasm, sdk, cls };
}

async function getCore() { return true; }
const workerTail = `
self.onmessage = async (ev) => {
  const m = ev.data;
  try {
    if (m.t === 'init') { await coreInit(m.files); postMessage({ t: 'ready' }); }
    else if (m.t === 'run') { await coreRun(m.code, m.input, true, x => postMessage(x)); }
  } catch (e) { postMessage({ t: 'fatal', msg: String(e && e.message || e) }); }
};`;

function startWorker() {
  return new Promise((resolve, reject) => {
    let w;
    try { w = new Worker(URL.createObjectURL(new Blob(['const __F = ' + CORE.toString() + ';\nconst { coreInit, coreRun } = __F();\n' + workerTail], { type: 'text/javascript' }))); }
    catch (e) { reject(e); return; }
    let settled = false;
    w.onerror = e => { if (!settled) { settled = true; w.terminate(); reject(new Error('worker')); } };
    w.onmessage = ev => {
      const m = ev.data;
      if (!settled) {
        if (m.t === 'ready') { settled = true; w.onmessage = e2 => onMsg && onMsg(e2.data); resolve(w); }
        else if (m.t === 'fatal') { settled = true; w.terminate(); reject(new Error(m.msg)); }
      }
    };
    w.postMessage({ t: 'init', files: { rt: files.rt, wasm: files.wasm.slice(0), sdk: files.sdk.slice(0), cls: files.cls.slice(0) } });
  });
}

async function startInline() {
  api = CORE();
  await api.coreInit({ rt: files.rt, wasm: files.wasm, sdk: files.sdk, cls: files.cls });
  inline = true;
}

function ensure() {
  if (!ready) ready = (async () => {
    await getCore();
    files = files || await loadFiles();
    try { worker = await startWorker(); }
    catch (e) { await startInline(); }
    st.textContent = 'Sẵn sàng · javac 21 + TeaVM' + (inline ? ' (chế độ không có giới hạn thời gian)' : '');
  })().catch(e => { ready = null; throw e; });
  return ready;
}

function finish() { busy = false; goBtn.disabled = false; clearTimeout(timer); }

function handle(m, t0) {
  if (m.t === 'phase') st.textContent = m.p === 'compile' ? 'Đang biên dịch…' : 'Đang dịch sang WebAssembly…';
  else if (m.t === 'diags') {
    const list = m.list.filter(d => d.msg);
    const errs = list.filter(d => !d.sev || /error/i.test(d.sev));
    const show = errs.length ? errs : list;
    const lines = getCode().split('\n');
    show.forEach(d => {
      const ln = d.line > 0 ? d.line : 0;
      const head = (d.file || m.fname) + (ln ? ':' + ln : '') + ': error: ';
      const msg = d.msg.split('\n');
      if (ln) { addLink(head, ln); markLine(ln); } else addOut(head, 'e');
      addOut(msg[0] + '\n', 'e');
      if (ln && lines[ln - 1] !== undefined && (d.file || m.fname) === m.fname) {
        addOut(lines[ln - 1] + '\n', 'm');
        if (d.col > 0) addOut(' '.repeat(Math.max(0, d.col - 1)) + '^\n', 'e');
      }
      if (msg.length > 1) addOut(msg.slice(1).join('\n') + '\n', 'm');
    });
    addOut(show.length + (show.length > 1 ? ' errors' : ' error') + '\n', 'e');
    if (show.some(d => /method getClass\(\)/.test(d.msg))) addOut('\nGhi chú: bản chạy trong trình duyệt thiếu getClass(). Code của bạn có thể không sai, hãy bấm "JDK thật ↗" để chạy bằng Java đầy đủ.\n', 'm');
    st.textContent = 'Biên dịch lỗi · ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s';
    askBtn.style.display = '';
    if (show[0] && show[0].line > 0) jump(show[0].line);
    finish();
  }
  else if (m.t === 'nomain') { addOut('Không tìm thấy hàm main.\nHãy có: public static void main(String[] args) { ... }\n', 'e'); st.textContent = 'Thiếu main'; finish(); }
  else if (m.t === 'unsupported') {
    const cls = [...new Set((m.list || []).map(d => { const f = String(d.file || '').match(/classlib\/(.*)\/T(\w+)\.java$/); return f ? f[1].replace(/\//g, '.') + '.' + f[2] : null; }).filter(Boolean))];
    addOut('Code biên dịch đúng, nhưng dùng tính năng mà bản chạy trong trình duyệt chưa hỗ trợ' + (cls.length ? ': ' + cls.join(', ') : '') + (cls.some(c => /Thread/.test(c)) ? ' (đa luồng)' : '') + '.\nBấm "JDK thật ↗" để chạy bằng Java đầy đủ.\n', 'e');
    st.textContent = 'Chưa hỗ trợ trong trình duyệt';
    finish();
  }
  else if (m.t === 'start') {
    st.textContent = 'Đang chạy…';
    if (!inline) timer = setTimeout(() => {
      worker.terminate(); worker = null; ready = null;
      addOut('\n[Đã dừng: chạy quá ' + RUN_LIMIT / 1000 + ' giây, có thể bị vòng lặp vô hạn]\n', 'e');
      st.textContent = 'Đã dừng do quá thời gian';
      askBtn.style.display = '';
      finish();
    }, RUN_LIMIT);
  }
  else if (m.t === 'out') addOut(m.s, m.err ? 'e' : '');
  else if (m.t === 'cut') addOut('\n[Output quá dài, đã cắt bớt]\n', 'm');
  else if (m.t === 'done') {
    if (m.trap) {
      const hit = TRAPS.find(([re]) => re.test(m.trap));
      if (plain && !plain.endsWith('\n')) addOut('\n');
      addOut('Exception in thread "main" ' + (hit ? hit[1] : 'java.lang.Error: ' + m.trap) + '\n', 'e');
      addOut('(Trong trình duyệt, lỗi này dừng chương trình ngay, không bắt được bằng try/catch. Muốn xem chính xác như JDK thì bấm "JDK thật ↗".)\n', 'm');
      askBtn.style.display = '';
    } else if (/Exception in thread/.test(plain)) askBtn.style.display = '';
    if (needInput) { finish(); askInput(); return; }
    if (!plain.trim()) addOut('(Chương trình chạy xong, không in ra gì)\n', 'm');
    if (m.notes && m.notes.includes('package')) addOut('(Đã bỏ qua dòng package để chạy được trong một file)\n', 'm');
    const lvl = m.level === 'full' ? '' : ' · chế độ rút gọn: lỗi null/mảng/chia 0 có thể không bắt được';
    st.textContent = 'Chạy xong · ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s (biên dịch ' + ((m.ms.compile + m.ms.build) / 1000).toFixed(1) + ' s, chạy ' + m.ms.run + ' ms)' + lvl;
    finish();
  }
  else if (m.t === 'fatal') { addOut('Lỗi bộ chạy: ' + m.msg + '\n', 'e'); st.textContent = 'Lỗi bộ chạy'; worker && worker.terminate(); worker = null; ready = null; finish(); }
}

function askInput() {
  const inp = document.createElement('input');
  inp.className = 'jr-cin'; inp.type = 'text'; inp.spellcheck = false; inp.setAttribute('aria-label', 'Nhập dữ liệu cho chương trình');
  outEl.appendChild(inp);
  st.textContent = 'Chương trình đang chờ bạn nhập · gõ rồi nhấn Enter';
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const box = $('jr-in');
      box.value = box.value + (box.value && !box.value.endsWith('\n') ? '\n' : '') + inp.value + '\n';
      run();
    } else if (e.key === 'Escape') { inp.remove(); st.textContent = 'Đã dừng nhập'; }
  });
  try { inp.focus({ preventScroll: true }); } catch (e) { }
  outEl.scrollTop = outEl.scrollHeight;
}

async function run() {
  if (busy) return;
  const code = getCode();
  if (!code.trim()) { errEl.textContent = 'Nhập code trước đã'; return; }
  errEl.textContent = ''; askBtn.style.display = 'none';
  busy = true; goBtn.disabled = true; clearMarks(); clearOut();
  const t0 = Date.now();
  try { await ensure(); }
  catch (e) {
    addOut('Không khởi động được bộ chạy trong trình duyệt:\n' + (e && e.message || e) + '\n\nBạn vẫn có thể bấm "JDK thật ↗" để Claude chạy bằng JDK 21.\n', 'e');
    st.textContent = 'Không dùng được bộ chạy trong trình duyệt';
    finish(); return;
  }
  const input = $('jr-in').value;
  const t1 = Date.now();
  onMsg = m => handle(m, t1);
  if (inline) {
    setTimeout(async () => {
      try { await api.coreRun(code, input, true, m => handle(m, t1)); }
      catch (e) { handle({ t: 'fatal', msg: String(e && e.message || e) }, t1); }
    }, 20);
  } else worker.postMessage({ t: 'run', code, input });
}

goBtn.addEventListener('click', run);
$('jr-jdk').addEventListener('click', () => {
  const code = getCode().trim();
  if (!code) { errEl.textContent = 'Nhập code trước đã'; return; }
  const inp = $('jr-in').value;
  let msg = '▶ Chạy bằng JDK thật (' + LESSON + ' — ' + names[cur] + '):\n```java\n' + code + '\n```';
  if (inp.trim()) msg += '\nInput:\n```\n' + inp + '\n```';
  sendPrompt(msg);
});
askBtn.addEventListener('click', () => {
  const code = getCode().trim();
  sendPrompt('Giải thích lỗi này giúp mình (' + LESSON + '):\n```java\n' + code + '\n```\nKết quả:\n```\n' + plain.trim().slice(0, 3000) + '\n```');
});

return { upgradeEditor };

  })();
  loadCM().then(() => ui.upgradeEditor());
  return ui;
}
window.JavaRunner = { mount, version: '1' };
})();
