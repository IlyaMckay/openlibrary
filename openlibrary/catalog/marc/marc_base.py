import re

re_isbn = re.compile(r'([^ ()]+[\dX])(?: \((?:v\. (\d+)(?: : )?)?(.*)\))?')
# handle ISBN like: 1402563884c$26.95
re_isbn_and_price = re.compile(r'^([-\d]+X?)c\$[\d.]+$')


class MarcException(Exception):
    # Base MARC exception class
    pass


class BadMARC(MarcException):
    pass


class NoTitle(MarcException):
    pass


class MarcFieldBase:
    pass


class MarcBase:
    def read_isbn(self, f):
        found = []
        for k, v in f.get_subfields(['a', 'z']):
            m = re_isbn_and_price.match(v)
            if not m:
                m = re_isbn.match(v)
            if not m:
                continue
            found.append(m.group(1))
        return found

    def build_fields(self, want: list[str]) -> None:
        self.fields = {}
        want = set(want)
        for tag, line in self.read_fields(want):
            self.fields.setdefault(tag, []).append(line)

    def get_fields(self, tag: str) -> list[str | MarcFieldBase]:
        return [v for k, v in self.read_fields([tag])]

    def get_linkage(self, original: str, link: str):
        """
        :param original str: The original field e.g. '245'
        :param link str: The linkage {original}$6 value e.g. '880-01'
        :rtype: BinaryDataField | None
        :return: alternate script field (880) corresponding to original or None
        """
        linkages = self.read_fields(['880'])
        target = link.replace('880', original)
        for tag, f in linkages:
            if f.get_subfield_values(['6'])[0].startswith(target):
                return f
        return None
