import sys
import json
import base64

def normalize_variable(name, var_mapping):
    if name not in var_mapping:
        var_mapping[name] = 'VAR{}'.format(len(var_mapping) + 1)
    return var_mapping[name]

def normalize_function(name, func_mapping):
    if name not in func_mapping:
        func_mapping[name] = 'FUNC{}'.format(len(func_mapping) + 1)
    return func_mapping[name]

def traverse_node(node, result, var_mapping, func_mapping, parent_node_type=None):
    if 'nodeType' in node:
        if node['nodeType'] == 'Comment':
            return
        result.append(node["nodeType"])

    # if 'value' in node and isinstance(node['value'], str):
    #     if node['nodeType'] == 'Stmt_InlineHTML':
    #         result.append(node['value'].strip().replace('\n', ' '))
    #     else:
    #         if node['value'].startswith('\'') or node['value'].startswith('"'):
    #             result.append(node['value'][0])
    #             if len(node['value']) > 1:
    #                 result.append('DUMMY')
    #         else:
    #             result.append('DUMMY')
    #         if (node['value'].endswith('\'') or node['value'].endswith('"')) and len(node['value']) > 1:
    #             result.append(node['value'][-1])

    # if 'value' in node and isinstance(node['value'], str):
    #     if node['nodeType'] == 'Stmt_InlineHTML':
    #         pass
    #     else:
    #         if node['value'].startswith('\'') or node['value'].startswith('"'):
    #             result.append(node['value'][0])
    #             if len(node['value']) > 1:
    #                 result.append('DUMMY')
    #         else:
    #             result.append('DUMMY')
    #         if (node['value'].endswith('\'') or node['value'].endswith('"')) and len(node['value']) > 1:
    #             result.append(node['value'][-1])

    # if 'value' in node and isinstance(node['value'], str):
    #     if node['nodeType'] == 'Stmt_InlineHTML':
    #         result.append(node['value'].strip().replace('\n', ' '))
    #     else:
    #         result.append(node['value'])

    if 'value' in node and isinstance(node['value'], str):
        if node['nodeType'] == 'Stmt_InlineHTML':
            pass
        else:
            result.append(node['value'])

    elif 'name' in node and isinstance(node["name"], str):
        if node['nodeType'] == 'Expr_Variable':
            node['name'] = normalize_variable(node['name'], var_mapping)
        elif node['nodeType'] == 'Identifier' and parent_node_type == 'Stmt_Function':
            node['name'] = normalize_function(node['name'], func_mapping)
        elif node['nodeType'] == 'Name' and parent_node_type == 'Expr_FuncCall' and node['name'] in func_mapping:
            node['name'] = normalize_function(node['name'], func_mapping)
        result.append(node['name'])

    for key, value in node.items():
        if isinstance(value, dict):
            traverse_node(value, result, var_mapping, func_mapping, node.get('nodeType'))
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, dict):
                    traverse_node(item, result, var_mapping, func_mapping, node.get('nodeType'))

def traverse_json(json_data):
    result = []
    var_mapping = {}
    func_mapping = {}
    if isinstance(json_data, list):
        for item in json_data:
            if isinstance(item, dict):
                traverse_node(item, result, var_mapping, func_mapping)
    elif isinstance(json_data, dict):
        traverse_node(json_data, result, var_mapping, func_mapping)
    return result

def main():
    if len(sys.argv) != 2:
        print('Usage: python script.py <json_file>')
        sys.exit(1)

    data = base64.b64decode(sys.argv[1]).decode()

    result = traverse_json(json.loads(data))

    print(' '.join(result))

if __name__ == '__main__':
    main()
