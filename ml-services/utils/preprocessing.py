def extract_data(value):
    """
    Extract useful data from a backend API response.

    Supports:
    - Direct list
    - Direct dictionary
    - { "data": ... }
    - { "results": ... }
    """

    if value is None:
        return None

    if isinstance(value, dict):

        if "data" in value:
            return value["data"]

        if "results" in value:
            return value["results"]

    return value


def ensure_list(value):
    """
    Convert a value into a list without creating
    fake application data.
    """

    if value is None:
        return []

    if isinstance(value, list):
        return value

    return [value]